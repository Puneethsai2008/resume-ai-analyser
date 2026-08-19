from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

OUTPUT_PATH = r"C:\Users\puneeth\Documents\ChatGPT\Resume Analyser\output\pdf\ava-patel-sample-resume.pdf"

PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN_X = 0.62 * inch
MARGIN_Y = 0.54 * inch

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="CandidateName",
    parent=styles["Heading1"],
    fontName="Helvetica-Bold",
    fontSize=21,
    leading=24,
    textColor=colors.HexColor("#0F172A"),
    spaceAfter=2,
))
styles.add(ParagraphStyle(
    name="Role",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=10.5,
    leading=14,
    textColor=colors.HexColor("#2563EB"),
    spaceAfter=3,
))
styles.add(ParagraphStyle(
    name="Contact",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.6,
    leading=11,
    textColor=colors.HexColor("#475569"),
    spaceAfter=9,
))
styles.add(ParagraphStyle(
    name="Section",
    parent=styles["Heading2"],
    fontName="Helvetica-Bold",
    fontSize=10,
    leading=13,
    textColor=colors.HexColor("#0F172A"),
    spaceBefore=8,
    spaceAfter=4,
))
styles.add(ParagraphStyle(
    name="BodySmall",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.8,
    leading=12.3,
    textColor=colors.HexColor("#243247"),
    alignment=TA_LEFT,
))
styles.add(ParagraphStyle(
    name="JobTitle",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=9.2,
    leading=11.5,
    textColor=colors.HexColor("#0F172A"),
))
styles.add(ParagraphStyle(
    name="Muted",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.2,
    leading=10.5,
    textColor=colors.HexColor("#64748B"),
))
styles.add(ParagraphStyle(
    name="BulletSmall",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.7,
    leading=11.3,
    leftIndent=10,
    firstLineIndent=-7,
    textColor=colors.HexColor("#243247"),
))


def p(text, style="BodySmall"):
    return Paragraph(text, styles[style])


def section(title):
    return [Spacer(1, 2), p(title.upper(), "Section"), HRFlowable(
        width="100%", thickness=0.6, color=colors.HexColor("#CBD5E1"), spaceBefore=0, spaceAfter=4
    )]


def bullet(text):
    return p(f"&bull; {text}", "BulletSmall")


doc = SimpleDocTemplate(
    OUTPUT_PATH,
    pagesize=A4,
    rightMargin=MARGIN_X,
    leftMargin=MARGIN_X,
    topMargin=MARGIN_Y,
    bottomMargin=MARGIN_Y,
    title="Ava Patel - Sample Resume",
    author="Fictional test resume",
)

story = []
story.append(p("Ava Patel", "CandidateName"))
story.append(p("Junior Frontend Developer", "Role"))
story.append(p("Bengaluru, India  |  ava.patel@example.com  |  github.com/avapatel-dev  |  linkedin.com/in/avapatel-dev", "Contact"))

story.extend(section("Professional Summary"))
story.append(p(
    "Junior frontend developer with hands-on experience building responsive web applications using React, Next.js, TypeScript, and Tailwind CSS. "
    "Comfortable integrating REST APIs, collaborating through Git and GitHub, and improving user experiences through clean, reusable components."
))

story.extend(section("Technical Skills"))
skills = [
    [p("<b>Frontend</b><br/>React, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS"),
     p("<b>Development</b><br/>REST APIs, Git, GitHub, Responsive Design, Component Architecture")],
    [p("<b>Tools</b><br/>VS Code, Figma, Postman, npm, Vercel"),
     p("<b>Learning</b><br/>Jest, Playwright, Web Performance, Accessibility")],
]
table = Table(skills, colWidths=[3.52 * inch, 3.52 * inch])
table.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
    ("TOPPADDING", (0, 0), (-1, -1), 1),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
]))
story.append(table)

story.extend(section("Experience"))
story.append(p("Frontend Developer Intern | BrightPath Digital, Bengaluru", "JobTitle"))
story.append(p("Jan 2025 - Jun 2025", "Muted"))
story.append(bullet("Built responsive dashboard screens with React, TypeScript, and Tailwind CSS, improving mobile usability across core user flows."))
story.append(bullet("Connected REST API endpoints for user profile, project, and status data; handled loading, error, and empty states."))
story.append(bullet("Worked with a small product team using GitHub pull requests and reusable UI components to deliver weekly updates."))

story.extend(section("Projects"))
story.append(p("TaskFlow - Team Task Management App | React, TypeScript, REST API", "JobTitle"))
story.append(bullet("Created a responsive task board with filters, status updates, and accessible forms; deployed a live preview on Vercel."))
story.append(p("Portfolio Website | Next.js, Tailwind CSS", "JobTitle"))
story.append(bullet("Designed and built a personal portfolio featuring project case studies, reusable components, and optimized responsive layouts."))

story.extend(section("Education"))
story.append(p("Bachelor of Computer Applications (BCA) | Fictional Institute of Technology | 2022 - 2025"))

story.append(Spacer(1, 8))
story.append(p("This is a fictional sample resume created only for software testing.", "Muted"))

doc.build(story)
