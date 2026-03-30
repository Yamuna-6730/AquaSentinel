from fastapi import APIRouter
from fastapi.responses import FileResponse
import google.generativeai as genai
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
import matplotlib.pyplot as plt
import os
import uuid
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

router = APIRouter(tags=["report"])

model = genai.GenerativeModel("gemini-2.0-flash")

def generate_prompt(data):
    return f"""
You are an advanced AI system for submarine monitoring and maritime intelligence.

Analyze the following operational data and generate a structured professional report.

DATA:
- Threats Detected: {data['threats']}
- Visibility: {data['visibility']}%
- Risk Level: {data['risk']}
- Detection Accuracy: {data['accuracy']}

INSTRUCTIONS:
Write in a formal operational tone.

STRUCTURE:
1. Executive Summary (2–3 lines)
2. Key Observations (bullet points)
3. Risk Assessment (clear explanation)
4. Environmental Analysis
5. Recommendations (actionable steps)

Make it realistic for submarine operators.
Avoid generic AI text.
"""

# 🤖 Gemini call
def get_ai_report(data):
    try:
        response = model.generate_content(generate_prompt(data))
        return response.text
    except Exception as e:
        print(f"AI Generation Error: {e}")
        return "AI report generation currently unavailable. Please check system logs."


# 📊 Chart 1: Detection Trend
def create_line_chart(data, filename):
    values = [d["v"] for d in data["lineData"]]

    plt.figure()
    plt.plot(values, marker='o')
    plt.title("Detection Confidence Trend")
    plt.xlabel("Time")
    plt.ylabel("Confidence")
    plt.grid()
    plt.savefig(filename)
    plt.close()


# 📊 Chart 2: Detection Activity
def create_bar_chart(data, filename):
    names = [d["name"] for d in data["barData"]]
    values = [d["value"] for d in data["barData"]]

    plt.figure()
    plt.bar(names, values)
    plt.title("Objects Detected per Scan")
    plt.savefig(filename)
    plt.close()


# 📊 Chart 3: Visibility
def create_visibility_chart(data, filename):
    values = [d["v"] for d in data["lineData"]]

    plt.figure()
    plt.plot(values)
    plt.title("Visibility Trend")
    plt.savefig(filename)
    plt.close()


# 📄 PREMIUM PDF
def create_pdf(report_text, data):

    filename = f"report_{uuid.uuid4().hex}.pdf"

    doc = SimpleDocTemplate(filename)

    styles = getSampleStyleSheet()

    # 🎨 Custom styles
    title_style = ParagraphStyle(
        'title',
        parent=styles['Heading1'],
        textColor=HexColor("#00eaff")
    )

    section_style = ParagraphStyle(
        'section',
        parent=styles['Heading2'],
        textColor=HexColor("#0284c7")
    )

    normal_style = styles["BodyText"]

    elements = []

    # 🏷 Title
    elements.append(Paragraph("AquaSentinel AI Intelligence Report", title_style))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph(f"Generated on: {datetime.now()}", normal_style))
    elements.append(Spacer(1, 20))

    # 📊 Metrics Summary
    elements.append(Paragraph("System Snapshot", section_style))
    elements.append(Spacer(1, 10))

    summary_text = f"""
    Threats Detected: {data['threats']}<br/>
    Visibility: {data['visibility']}%<br/>
    Risk Level: {data['risk']}<br/>
    Accuracy: {round(data['accuracy'] * 100,2)}%
    """

    elements.append(Paragraph(summary_text, normal_style))
    elements.append(Spacer(1, 20))

    # 🤖 AI REPORT
    elements.append(Paragraph("AI Analysis", section_style))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph(report_text.replace("\n", "<br/>"), normal_style))
    elements.append(Spacer(1, 20))

    # 📊 Charts
    chart1 = "chart1.png"
    chart2 = "chart2.png"
    chart3 = "chart3.png"

    create_line_chart(data, chart1)
    create_bar_chart(data, chart2)
    create_visibility_chart(data, chart3)

    elements.append(Paragraph("Visual Insights", section_style))
    elements.append(Spacer(1, 10))

    elements.append(Image(chart1, width=400, height=200))
    elements.append(Spacer(1, 10))

    elements.append(Image(chart2, width=400, height=200))
    elements.append(Spacer(1, 10))

    elements.append(Image(chart3, width=400, height=200))

    doc.build(elements)

    # cleanup
    os.remove(chart1)
    os.remove(chart2)
    os.remove(chart3)

    return filename


# 🚀 API
@router.post("/generate-report")
async def generate_report(data: dict):
    try:
        # AI
        ai_text = get_ai_report(data)

        # PDF
        pdf_path = create_pdf(ai_text, data)

        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename="AquaSentinel_Report.pdf"
        )
    except Exception as e:
        return {"error": str(e)}
