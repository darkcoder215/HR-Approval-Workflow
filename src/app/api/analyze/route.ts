import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData } = body;

    if (!formData) {
      return NextResponse.json({ error: "بيانات النموذج مطلوبة" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "مفتاح API غير مُعرّف" }, { status: 500 });
    }

    const prompt = buildAnalysisPrompt(formData);

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://hr-approval.thmanyah.com",
        "X-Title": "Thmanyah HR Vacancy Approval",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content: `أنت محلل موارد بشرية خبير في شركة ثمانية الإعلامية السعودية. مهمتك تحليل طلبات فتح الشواغر الوظيفية وتقديم تقييم شامل ومختصر لاحتمالية الحاجة الفعلية للتوظيف.

يجب أن يكون تحليلك:
- باللغة العربية الفصحى
- مباشر وعملي بدون حشو
- مبني على البيانات المقدمة في النموذج
- يتضمن نسبة مئوية لاحتمالية الحاجة الفعلية

أجب بتنسيق JSON فقط بالهيكلة التالية:
{
  "overallScore": <رقم من 0 إلى 100>,
  "scoreLabel": "<تسمية: حاجة ملحة / حاجة مبررة / حاجة متوسطة / حاجة ضعيفة / غير مبرر>",
  "summary": "<ملخص تنفيذي من 2-3 جمل>",
  "strengths": ["<نقطة قوة 1>", "<نقطة قوة 2>", ...],
  "concerns": ["<ملاحظة أو تحفظ 1>", "<ملاحظة أو تحفظ 2>", ...],
  "aiImpact": "<تقييم مختصر لأثر الذكاء الاصطناعي على الحاجة لهذا الدور>",
  "recommendation": "<توصية نهائية من جملة واحدة>"
}`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter error:", errorData);
      return NextResponse.json(
        { error: "فشل في الاتصال بخدمة التحليل" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "لم يتم استلام رد من خدمة التحليل" },
        { status: 502 }
      );
    }

    // Parse the JSON from the AI response
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      const analysis = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ analysis });
    } catch {
      console.error("Failed to parse AI response:", content);
      return NextResponse.json(
        { error: "فشل في تحليل الرد" },
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

function buildAnalysisPrompt(form: Record<string, string>): string {
  const vacancyTypeLabel = form.vacancyType === "replacement" ? "بديل" : "مستحدث";
  const triedAlt = form.triedAlternatives === "yes" ? "نعم" : "لا";

  let prompt = `حلل طلب فتح الشاغر التالي وقدم تقييمك:

## بيانات الطلب
- **الإدارة**: ${form.department}
- **القسم/الفريق**: ${form.section} / ${form.team}
- **المشروع**: ${form.project || "غير محدد"}
- **نوع الشاغر**: ${vacancyTypeLabel}
- **العدد المطلوب**: ${form.positionsCount}
`;

  if (form.vacancyType === "replacement") {
    prompt += `
## بيانات الاستبدال
- **الموظف السابق**: ${form.previousEmployeeName}
- **نوع المغادرة**: ${form.departureType === "resignation" ? "استقالة" : "فصل"}
- **سبب المغادرة**: ${form.departureReason}
`;
  }

  if (form.vacancyType === "new_position") {
    prompt += `
## شاغر مستحدث
- **ضمن الهيكلة المعتمدة**: ${form.isInApprovedStructure === "yes" ? "نعم" : "لا"}
${form.structureJustification ? `- **تبرير خارج الهيكلة**: ${form.structureJustification}` : ""}
`;
  }

  prompt += `
## تفاصيل الدور
- **المسمى**: ${form.jobTitle}
- **المستوى**: ${form.jobLevel}
- **طبيعة الدور**: ${form.roleNature}
- **الوصف الوظيفي**: ${form.jobDescription}
- **الدولة**: ${form.country}

## تقييم الحاجة
- **جرب حلول بديلة**: ${triedAlt}
${form.alternativesDescription ? `- **الحلول المجربة**: ${form.alternativesDescription}` : ""}
${form.whyNoAlternatives ? `- **سبب عدم تجربة بدائل**: ${form.whyNoAlternatives}` : ""}
- **المخاطر في حال عدم التوظيف**: ${form.risksIfNotHired}

## تقييم الذكاء الاصطناعي
- **تفعيل AI في الدور**: ${form.aiRoleIntegration}
- **إمكانية الأتمتة**: ${form.aiAutomationPotential}
- **إمكانية الاستبدال بـ AI**: ${form.aiReplacementAssessment}

## معيار التوظيف
${form.hiringBarCommitment}

## تعريف النجاح
- **المخرجات خلال 3 أشهر**: ${form.expectedOutputs3Months || "غير محدد"}
- **المخرجات خلال 6 أشهر**: ${form.expectedOutputs6Months || "غير محدد"}
- **مؤشرات النجاح**: ${form.successMetrics || "غير محدد"}
`;

  return prompt;
}
