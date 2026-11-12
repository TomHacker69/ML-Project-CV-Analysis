from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

SAMPLE_RESUME = """
Jane Doe
jane.doe@example.com | +1 555-0199 | linkedin.com/in/janedoe | github.com/janedoe

Professional Summary
Senior Software Engineer with 5+ years of experience designing, developing, and deploying scalable cloud microservices. Led cross-functional engineering teams to reduce API latency by 42% and improve uptime to 99.99%.

Technical Skills
Languages: Python, JavaScript, TypeScript, Go, SQL
Frameworks: FastAPI, React, Node.js, Django
Cloud & DevOps: Docker, Kubernetes, AWS, CI/CD, Git, Linux
Core Competencies: System Architecture, Microservices, Agile, REST APIs

Work Experience
Senior Software Engineer — TechCorp (2022 - Present)
• Architected high-throughput payment processing microservice handling over 10M daily transactions.
• Optimized database indexing and caching with Redis, reducing query response times by 35%.
• Mentored 4 junior developers in code review best practices and test-driven development.
• Collaborated with product managers to deliver 6 major product milestones on schedule.

Software Engineer — CloudScale Solutions (2019 - 2022)
• Developed scalable backend REST APIs using Python and FastAPI for enterprise clients.
• Implemented automated CI/CD deployment pipelines using GitHub Actions and Docker.
• Solved critical concurrency bottlenecks, improving overall application stability.

Education
Bachelor of Science in Computer Science — University of California (2015 - 2019)

Projects
CloudMonitor: Open-source distributed telemetry monitoring tool with 500+ GitHub stars. Built with Go and React.
"""


def test_section_completeness():
    res = client.post("/features/section-completeness", json={"cv_text": SAMPLE_RESUME})
    assert res.status_code == 200
    data = res.json()
    assert "completeness_score" in data
    assert data["completeness_score"] >= 70
    assert "sections" in data
    assert data["completed_count"] >= 4


def test_keyword_density():
    res = client.post("/features/keyword-density", json={"cv_text": SAMPLE_RESUME, "target_role": "software engineer"})
    assert res.status_code == 200
    data = res.json()
    assert "total_words" in data
    assert "top_keywords" in data
    assert len(data["top_keywords"]) > 0
    assert "density_score" in data


def test_language_detection():
    # English
    res_en = client.post("/features/language-detect", json={"cv_text": SAMPLE_RESUME})
    assert res_en.status_code == 200
    assert res_en.json()["language_code"] == "en"

    # Spanish snippet
    es_text = "Experiencia laboral en desarrollo de software y educacion universitaria en computacion."
    res_es = client.post("/features/language-detect", json={"cv_text": es_text})
    assert res_es.status_code == 200
    assert res_es.json()["language_code"] == "es"


def test_readability_analysis():
    res = client.post("/features/readability", json={"cv_text": SAMPLE_RESUME})
    assert res.status_code == 200
    data = res.json()
    assert "flesch_reading_ease" in data
    assert "flesch_kincaid_grade" in data
    assert "gunning_fog" in data
    assert "readability_level" in data


def test_industry_eval():
    res = client.post("/features/industry-eval", json={"cv_text": SAMPLE_RESUME, "industry_key": "tech"})
    assert res.status_code == 200
    data = res.json()
    assert data["industry_key"] == "tech"
    assert data["fit_score"] >= 60
    assert len(data["matched_keywords"]) >= 5


def test_benchmark_comparison():
    res = client.post("/features/benchmark", json={
        "cv_text": SAMPLE_RESUME,
        "role": "software engineer",
        "skills": ["Python", "JavaScript", "Docker", "AWS", "FastAPI", "React", "SQL"]
    })
    assert res.status_code == 200
    data = res.json()
    assert "overall_percentile" in data
    assert len(data["metrics"]) == 4


def test_soft_skills_extraction():
    res = client.post("/features/soft-skills", json={"cv_text": SAMPLE_RESUME})
    assert res.status_code == 200
    data = res.json()
    assert data["total_detected"] >= 2
    assert "Leadership & Mentorship" in data["detected_by_category"]
    assert "soft_skills_score" in data


def test_recruiter_summary():
    res = client.post("/features/recruiter-summary", json={
        "cv_text": SAMPLE_RESUME,
        "candidate_name": "Jane Doe",
        "target_role": "Senior Software Engineer"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["candidate_name"] == "Jane Doe"
    assert "headline" in data
    assert "elevator_pitch" in data
    assert "formatted_copy_text" in data


def test_quality_checklist():
    res = client.post("/features/quality-checklist", json={"cv_text": SAMPLE_RESUME})
    assert res.status_code == 200
    data = res.json()
    assert data["overall_quality_score"] >= 70
    assert len(data["categories"]) == 4


def test_linkedin_comparison():
    linkedin_export = """
    Jane Doe
    Senior Software Engineer at TechCorp
    Experience: TechCorp, CloudScale Solutions
    Skills: Python, React, Docker, AWS, PostgreSQL, Go, Machine Learning
    """
    res = client.post("/features/linkedin-compare", json={
        "cv_text": SAMPLE_RESUME,
        "linkedin_text": linkedin_export
    })
    assert res.status_code == 200
    data = res.json()
    assert "consistency_score" in data
    assert len(data["matched_skills"]) >= 3
    assert "inconsistencies" in data
