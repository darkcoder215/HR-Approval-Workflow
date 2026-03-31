import { NextRequest, NextResponse } from "next/server";

const AI_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData } = body;

    if (!formData) {
      return NextResponse.json({ error: "بيانات النموذج مطلوبة" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is not set in environment variables");
      return NextResponse.json({ error: "مفتاح API غير مُعرّف — يرجى التأكد من إعداد المتغير OPENROUTER_API_KEY في Vercel" }, { status: 500 });
    }

    const prompt = buildAnalysisPrompt(formData);

    const response = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://hr-approval.thmanyah.com",
        "X-Title": "Thmanyah HR Vacancy Approval",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-preview",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("AI API error:", response.status, errorData);
      return NextResponse.json(
        { error: `فشل في الاتصال بخدمة التحليل (${response.status})`, debug: errorData },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("Empty AI response. Full response:", JSON.stringify(data).slice(0, 500));
      return NextResponse.json(
        { error: "لم يتم استلام رد من خدمة التحليل" },
        { status: 502 }
      );
    }

    try {
      // Try parsing the content directly first (structured output mode)
      let analysis;
      try {
        analysis = JSON.parse(content);
      } catch {
        // Fallback: extract JSON from markdown code blocks or raw text
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || content.match(/(\{[\s\S]*\})/);
        if (!jsonMatch) {
          throw new Error("No JSON found in response");
        }
        analysis = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      }

      // Validate required fields and provide defaults
      const validated = {
        overallScore: analysis.overallScore ?? 50,
        scoreLabel: analysis.scoreLabel ?? "حاجة متوسطة",
        summary: analysis.summary ?? "لم يتم تقديم ملخص",
        dimensions: Array.isArray(analysis.dimensions) ? analysis.dimensions : [],
        strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
        concerns: Array.isArray(analysis.concerns) ? analysis.concerns : [],
        aiRiskAssessment: analysis.aiRiskAssessment ?? "",
        budgetConsideration: analysis.budgetConsideration ?? "",
        recommendation: analysis.recommendation ?? "يرجى المتابعة مع إدارة المواهب",
        suggestedQuestions: Array.isArray(analysis.suggestedQuestions) ? analysis.suggestedQuestions : [],
      };

      return NextResponse.json({ analysis: validated });
    } catch (parseErr) {
      console.error("Failed to parse AI response:", parseErr, "\nRaw content:", content.slice(0, 1000));
      return NextResponse.json(
        { error: "فشل في تحليل الرد — يرجى المحاولة مرة أخرى" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع" },
      { status: 500 }
    );
  }
}

const SYSTEM_PROMPT = `أنت محلل موارد بشرية استراتيجي خبير تعمل في شركة ثمانية الإعلامية السعودية — واحدة من أبرز شركات الإعلام والمحتوى في المنطقة. مهمتك إجراء تحليل عميق وشامل لطلبات فتح الشواغر الوظيفية.

## معايير التقييم (وزّع النقاط على أساس 100):

### 1. وضوح الحاجة والتبرير (25 نقطة)
- هل المبرر واضح ومحدد أم عام وغامض؟
- هل المخاطر المذكورة حقيقية وقابلة للقياس أم مبالغ فيها؟
- هل العدد المطلوب متناسب مع الحاجة المذكورة؟
- هل هناك ارتباط واضح بمشروع أو هدف استراتيجي؟

### 2. استنفاد البدائل (20 نقطة)
- هل تم تجربة حلول بديلة فعلاً (إعادة توزيع، أتمتة، تعاقد خارجي)؟
- إذا لم يتم، هل السبب مقنع؟
- هل يمكن تحقيق المطلوب بأقل من العدد المطلوب؟

### 3. تقييم أثر الذكاء الاصطناعي (20 نقطة)
- هل مقدم الطلب واعٍ لأثر AI على هذا الدور؟
- هل تم تقدير نسبة الأتمتة بشكل واقعي؟
- هل الدور معرض للاستبدال بالذكاء الاصطناعي خلال 2-3 سنوات؟
- هل يمكن دمج أدوات AI لتقليل العدد المطلوب؟

### 4. تعريف النجاح والمخرجات (20 نقطة)
- هل المخرجات المتوقعة واضحة وقابلة للقياس؟
- هل مؤشرات النجاح محددة أم عامة؟
- هل هناك فرق واضح بين مخرجات 3 أشهر و6 أشهر (تدرج منطقي)؟

### 5. جودة الطلب والاتساق (15 نقطة)
- هل الوصف الوظيفي مفصل وعملي؟
- هل معيار التوظيف المرفوع واقعي وطموح؟
- هل هناك تناقضات بين أجزاء الطلب؟
- هل الطلب يعكس تفكيراً عميقاً أم سريعاً وسطحياً؟

## تعليمات الإخراج:

أجب بتنسيق JSON فقط بالهيكلة التالية (بدون أي نص خارج JSON):
{
  "overallScore": <رقم من 0 إلى 100>,
  "scoreLabel": "<حاجة ملحة (85-100) / حاجة مبررة (70-84) / حاجة متوسطة (50-69) / حاجة ضعيفة (30-49) / غير مبرر (0-29)>",
  "summary": "<ملخص تنفيذي من 3-4 جمل يلخص الموقف والتوصية>",
  "dimensions": [
    {
      "name": "وضوح الحاجة والتبرير",
      "score": <0-25>,
      "maxScore": 25,
      "detail": "<تحليل مفصل في 2-3 جمل مع استشهاد بما كتبه مقدم الطلب>"
    },
    {
      "name": "استنفاد البدائل",
      "score": <0-20>,
      "maxScore": 20,
      "detail": "<تحليل مفصل>"
    },
    {
      "name": "أثر الذكاء الاصطناعي",
      "score": <0-20>,
      "maxScore": 20,
      "detail": "<تحليل مفصل>"
    },
    {
      "name": "تعريف النجاح والمخرجات",
      "score": <0-20>,
      "maxScore": 20,
      "detail": "<تحليل مفصل>"
    },
    {
      "name": "جودة الطلب والاتساق",
      "score": <0-15>,
      "maxScore": 15,
      "detail": "<تحليل مفصل>"
    }
  ],
  "strengths": ["<نقطة قوة مبنية على بيانات فعلية من الطلب>", ...],
  "concerns": ["<ملاحظة أو تحفظ محدد مع ذكر السبب>", ...],
  "aiRiskAssessment": "<تقييم مفصل في 3-4 جمل لخطر استبدال هذا الدور بالذكاء الاصطناعي مع نسبة تقديرية وإطار زمني>",
  "budgetConsideration": "<تعليق على الأثر المالي: هل التوظيف استثمار مبرر أم تكلفة يمكن تجنبها؟ جملتين>",
  "recommendation": "<توصية نهائية واضحة ومحددة في 2-3 جمل>",
  "suggestedQuestions": ["<سؤال يجب طرحه على مقدم الطلب لتقوية القرار>", "<سؤال آخر>"]
}

## تعليمات مهمة:
- كن صريحاً ومباشراً — لا تجامل. إذا كان الطلب ضعيفاً قل ذلك بوضوح.
- استشهد بكلام مقدم الطلب الفعلي عند الإشارة لنقاط القوة أو الضعف.
- إذا كانت الإجابات عامة أو منسوخة، أشر لذلك.
- قيّم بناءً على ما كُتب فعلاً وليس على افتراضات.
- النسبة يجب أن تعكس التقييم الفعلي — لا تعطِ نسباً عالية من باب المجاملة.`;

function buildAnalysisPrompt(form: Record<string, string>): string {
  const vacancyTypeLabel = form.vacancyType === "replacement" ? "بديل لموظف سابق" : "شاغر مستحدث";
  const triedAlt = form.triedAlternatives === "yes" ? "نعم" : "لا";
  const roleNatureMap: Record<string, string> = {
    full_time: "دوام كامل",
    part_time: "دوام جزئي",
    contract: "عقد محدد المدة",
    freelance: "مستقل",
    intern: "متدرب",
  };

  let prompt = `# طلب فتح شاغر وظيفي — تحليل شامل

## البيانات الأساسية
| البند | القيمة |
|-------|--------|
| مقدم الطلب | ${form.requesterName} (${form.requesterEmail}) |
| الإدارة | ${form.department} |
| القسم | ${form.section || "غير محدد"} |
| الفريق | ${form.team} |
| المشروع | ${form.project || "غير محدد"} |
| صاحب الميزانية | ${form.budgetOwner} |
| نوع الشاغر | ${vacancyTypeLabel} |
| العدد المطلوب | ${form.positionsCount} |
`;

  if (form.vacancyType === "replacement") {
    prompt += `
## بيانات الموظف السابق
| البند | القيمة |
|-------|--------|
| الاسم | ${form.previousEmployeeName} |
| تاريخ المغادرة | ${form.departureDate} |
| نوع المغادرة | ${form.departureType === "resignation" ? "استقالة" : "فصل"} |
| سبب المغادرة | ${form.departureReason} |
`;
  }

  if (form.vacancyType === "new_position") {
    prompt += `
## تفاصيل الشاغر المستحدث
| البند | القيمة |
|-------|--------|
| ضمن الهيكلة المعتمدة | ${form.isInApprovedStructure === "yes" ? "نعم" : "لا"} |
${form.structureJustification ? `| تبرير خارج الهيكلة | ${form.structureJustification} |` : ""}
`;
  }

  prompt += `
## تفاصيل الدور الوظيفي
| البند | القيمة |
|-------|--------|
| المسمى الوظيفي | ${form.jobTitle} |
| المستوى | ${form.jobLevel} |
| طبيعة الدور | ${roleNatureMap[form.roleNature] || form.roleNature} |
| الدولة | ${form.country} |
| الجنسية | ${form.nationality === "saudi" ? "سعودي" : "عربي"} |

### الوصف الوظيفي:
${form.jobDescription}

## تقييم الحاجة
- **هل جرب حلول بديلة؟**: ${triedAlt}
${form.triedAlternatives === "yes" ? `- **الحلول المجربة ونتائجها**: ${form.alternativesDescription}` : ""}
${form.triedAlternatives === "no" ? `- **سبب عدم تجربة بدائل**: ${form.whyNoAlternatives || "لم يُذكر"}` : ""}

### المخاطر والآثار السلبية في حال عدم التوظيف:
${form.risksIfNotHired}

## تقييم الذكاء الاصطناعي (كما كتبه مقدم الطلب)

### كيف يمكن تفعيل AI في هذا الدور:
${form.aiRoleIntegration}

### المهام القابلة للأتمتة:
${form.aiAutomationPotential}

### تقييم إمكانية الاستبدال بالذكاء الاصطناعي:
${form.aiReplacementAssessment}

## رفع معيار اختيار المواهب
${form.hiringBarCommitment}

## تعريف النجاح
### المخرجات المتوقعة خلال أول 3 أشهر:
${form.expectedOutputs3Months || "لم يُحدد"}

### المخرجات المتوقعة خلال أول 6 أشهر:
${form.expectedOutputs6Months || "لم يُحدد"}

### مؤشرات قياس النجاح والأثر:
${form.successMetrics || "لم يُحدد"}

---
قدّم تحليلك الشامل بتنسيق JSON فقط.`;

  return prompt;
}
