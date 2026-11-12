from ml_pipeline.skill_gap import compute_skill_gap

def test_skill_gap_computation():
    cand_skills = ['python', 'fastapi', 'git']
    jd = 'We need a software engineer proficient in Python, SQL, Docker, and Git.'
    res = compute_skill_gap(cand_skills, jd)
    assert 'match_percentage' in res
    assert 'Python' in res['matched_skills']
    assert len(res['missing_skills']) > 0
