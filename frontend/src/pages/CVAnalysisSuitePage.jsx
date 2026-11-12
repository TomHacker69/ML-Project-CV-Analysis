import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { ensureBackendReady } from '../services/backendReady';
import { classifyError } from '../utils/errorClassifier';

import SectionCompleteness from '../components/SectionCompleteness';
import ResumeWritingChecklist from '../components/ResumeWritingChecklist';
import KeywordDensity from '../components/KeywordDensity';
import ReadabilityScore from '../components/ReadabilityScore';
import IndustryEvaluation from '../components/IndustryEvaluation';
import BenchmarkComparison from '../components/BenchmarkComparison';
import SoftSkillsReport from '../components/SoftSkillsReport';
import RecruiterSummary from '../components/RecruiterSummary';
import ResumeQualityChecklist from '../components/ResumeQualityChecklist';
import LinkedInComparison from '../components/LinkedInComparison';

const DEMO_CV = `Jane Doe
jane.doe@example.com | +1 555-0199 | San Francisco, CA
linkedin.com/in/janedoe | github.com/janedoe

Professional Summary
Senior Software Engineer with 6+ years of experience architecting and deploying resilient cloud microservices. Led cross-functional teams to reduce backend latency by 42% and improve uptime to 99.99% across global payments infrastructure.

Technical Skills
Languages: Python, Go, TypeScript, JavaScript, SQL
Frameworks: FastAPI, React, Node.js, Django
Cloud & Infrastructure: Docker, Kubernetes, AWS (ECS, Lambda, S3), CI/CD, Git, Linux
Core Competencies: Distributed Systems, REST APIs, Microservices Architecture, Agile

Work Experience
Senior Software Engineer — CloudScale Technologies (2022 - Present)
• Architected high-throughput payment processing microservices handling over 12M daily transactions.
• Optimized database indexing and caching with Redis, reducing query response times by 35%.
• Mentored 5 junior and mid-level developers in test-driven development and system design patterns.
• Collaborated with product and security stakeholders to achieve SOC2 and PCI-DSS compliance.

Software Engineer — Nexus Systems (2019 - 2022)
• Developed scalable backend REST APIs using Python and FastAPI for enterprise clients.
• Implemented automated CI/CD deployment pipelines using GitHub Actions, cutting release cycles from days to hours.
• Solved concurrency bottlenecks under heavy load, improving system throughput by 50%.

Education
Bachelor of Science in Computer Science — University of California, Berkeley (2015 - 2019)

Projects
CloudMonitor: Open-source distributed telemetry monitoring tool with 800+ GitHub stars. Built with Go, React, and Prometheus.`;

export default function CVAnalysisSuitePage() {
  const [cvText, setCvText] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Results state
  const [sectionData, setSectionData] = useState(null);
  const [keywordData, setKeywordData] = useState(null);
  const [readabilityData, setReadabilityData] = useState(null);
  const [industryData, setIndustryData] = useState(null);
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [softSkillsData, setSoftSkillsData] = useState(null);
  const [recruiterData, setRecruiterData] = useState(null);
  const [qualityData, setQualityData] = useState(null);

  const handleAnalyze = async () => {
    if (!cvText.trim()) {
      setError('Please paste or load your CV text.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const isReady = await ensureBackendReady();
      if (!isReady) {
        setError('Server is waking up. Please try again in a few moments.');
        setLoading(false);
        return;
      }

      // Execute queries in parallel
      const [
        secRes,
        kwRes,
        readRes,
        indRes,
        bmRes,
        softRes,
        recRes,
        qualRes
      ] = await Promise.all([
        api.post('/features/section-completeness', { cv_text: cvText }),
        api.post('/features/keyword-density', { cv_text: cvText, target_role: 'software engineer' }),
        api.post('/features/readability', { cv_text: cvText }),
        api.post('/features/industry-eval', { cv_text: cvText, industry_key: 'tech' }),
        api.post('/features/benchmark', { cv_text: cvText, role: 'software engineer' }),
        api.post('/features/soft-skills', { cv_text: cvText }),
        api.post('/features/recruiter-summary', { cv_text: cvText }),
        api.post('/features/quality-checklist', { cv_text: cvText }),
      ]);

      setSectionData(secRes.data);
      setKeywordData(kwRes.data);
      setReadabilityData(readRes.data);
      setIndustryData(indRes.data);
      setBenchmarkData(bmRes.data);
      setSoftSkillsData(softRes.data);
      setRecruiterData(recRes.data);
      setQualityData(qualRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || classifyError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDemo = () => {
    setCvText(DEMO_CV);
    setError('');
  };

  const tabs = [
    { id: 'overview', label: 'Executive Brief', icon: '⚡' },
    { id: 'sections', label: 'Section Completeness', icon: '📋' },
    { id: 'quality', label: 'Quality Dashboard', icon: '🏆' },
    { id: 'keywords', label: 'Keyword Density', icon: '🔍' },
    { id: 'readability', label: 'Readability Scan', icon: '📖' },
    { id: 'industry', label: 'Industry Alignment', icon: '🏢' },
    { id: 'benchmarks', label: 'Competitive Benchmarks', icon: '📊' },
    { id: 'softskills', label: 'Soft Skills Report', icon: '🤝' },
    { id: 'checklist', label: 'Writing Guide', icon: '✅' },
    { id: 'linkedin', label: 'LinkedIn Reconciler', icon: '🔗' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 py-10 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Title Banner */}
        <div className="text-center space-y-2">
          <span className="inline-block bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-blue-400/30">
            TonyCV Intelligence Suite
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Full-Spectrum CV Analysis & Audit
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Comprehensive ATS breakdown, section completeness, keyword density, readability formulas, competitive benchmarks, soft skills, and LinkedIn reconciliation.
          </p>
        </div>

        {/* CV Input Section */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Input CV / Resume Text
            </label>
            <button
              onClick={handleLoadDemo}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              + Load Sample CV
            </button>
          </div>
          <textarea
            rows={7}
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="Paste your resume or CV text here to run comprehensive multi-module analysis..."
            className="w-full text-xs font-mono p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
          />
          {error && <p className="text-xs text-red-400 font-medium mt-2">{error}</p>}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 active:scale-95 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Running Intelligence Suite...
                </>
              ) : (
                'Run Full Intelligence Audit 🚀'
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/40'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Active Tab View */}
        <div className="space-y-6 text-slate-900">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <RecruiterSummary data={recruiterData} />
              {qualityData && <ResumeQualityChecklist data={qualityData} />}
            </div>
          )}

          {activeTab === 'sections' && (
            <SectionCompleteness data={sectionData} />
          )}

          {activeTab === 'quality' && (
            <ResumeQualityChecklist data={qualityData} />
          )}

          {activeTab === 'keywords' && (
            <KeywordDensity data={keywordData} />
          )}

          {activeTab === 'readability' && (
            <ReadabilityScore data={readabilityData} />
          )}

          {activeTab === 'industry' && (
            <IndustryEvaluation initialData={industryData} cvText={cvText} />
          )}

          {activeTab === 'benchmarks' && (
            <BenchmarkComparison data={benchmarkData} />
          )}

          {activeTab === 'softskills' && (
            <SoftSkillsReport data={softSkillsData} />
          )}

          {activeTab === 'checklist' && (
            <ResumeWritingChecklist />
          )}

          {activeTab === 'linkedin' && (
            <LinkedInComparison cvText={cvText} />
          )}
        </div>
      </div>
    </div>
  );
}
