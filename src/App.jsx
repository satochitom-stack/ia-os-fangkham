import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import PlanningView from './components/PlanningView';
import ExecutionView from './components/ExecutionView';
import ReportingView from './components/ReportingView';
import ControlRiskView from './components/ControlRiskView';
import LpaView from './components/LpaView';
import KnowledgeView from './components/KnowledgeView';
import LoginView from './components/LoginView';
import ChangePasswordModal from './components/ChangePasswordModal';
import ProfileSettingsModal from './components/ProfileSettingsModal';
import AuditRiskView, { defaultAuditUniverse } from './components/AuditRiskView';
import { getSession, logout as authLogout } from './utils/auth';

import {
  initialOrgProfile,
  initialAuditCharter,
  initialFiscalYears,
  initialAnnualPlans,
  initialWorkingPapers,
  initialRiskAssessments,
  initialInternalControls,
  initialLpaIndicators,
  initialKnowledgeBase
} from './data/initialData';

export default function App() {
  // Authentication State (single-user, client-side session)
  const [session, setSession] = useState(() => getSession());
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('ia_dark_mode');
    if (saved !== null) return saved === '1';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('ia_dark_mode', darkMode ? '1' : '0');
  }, [darkMode]);

  // Migration: Synchronously ensure sample data from D:\ drive is completely purged
  const [fiscalYears, setFiscalYears] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_fiscal_years');
      return saved ? JSON.parse(saved) : initialFiscalYears;
    } catch {
      return initialFiscalYears;
    }
  });

  useEffect(() => {
    localStorage.setItem('ia_fiscal_years', JSON.stringify(fiscalYears));
  }, [fiscalYears]);

  // Navigation & Fiscal Year State
  const [selectedYear, setSelectedYear] = useState('2568');
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedWp, setSelectedWp] = useState('WP-KTB-01');

  // Persistent States - Cleaned of D:\ sample data
  const [orgProfile, setOrgProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_org_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.auditorName?.includes('สุดารัตน์') ||
          parsed.auditorName?.includes('ศุภมงคล') ||
          parsed.name?.includes('ฝางคำ')
        ) {
          localStorage.removeItem('ia_org_profile');
          return initialOrgProfile;
        }
        return parsed;
      }
      return initialOrgProfile;
    } catch {
      return initialOrgProfile;
    }
  });

  // Persistent States isolated by fiscal year
  const [annualPlansByYear, setAnnualPlansByYear] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_annual_plans_by_year');
      if (saved) return JSON.parse(saved);
      const old = localStorage.getItem('ia_annual_plans');
      if (old) {
        const parsed = JSON.parse(old);
        if (Array.isArray(parsed)) {
          if (parsed.some((p) => p.title?.includes('ค่าเช่าบ้าน') || p.id === 'PLAN-68-01')) {
            return { '2568': [] };
          }
          return { '2568': parsed };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return { '2568': [] };
  });

  const [workingPapersByYear, setWorkingPapersByYear] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_working_papers_by_year');
      if (saved) return JSON.parse(saved);
      const old = localStorage.getItem('ia_working_papers');
      if (old) {
        const parsed = JSON.parse(old);
        if (Array.isArray(parsed)) {
          if (parsed.some((w) => w.finding?.condition?.includes('Maker') || w.samples?.length > 0)) {
            return { '2568': initialWorkingPapers };
          }
          return { '2568': parsed };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return { '2568': initialWorkingPapers };
  });

  const [riskAssessmentsByYear, setRiskAssessmentsByYear] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_risk_assessments_by_year');
      if (saved) return JSON.parse(saved);
      const old = localStorage.getItem('ia_risk_assessments');
      if (old) {
        const parsed = JSON.parse(old);
        if (Array.isArray(parsed)) {
          if (parsed.some((r) => r.activity?.includes('KTB') || r.id === 'RISK-01')) {
            return { '2568': [] };
          }
          return { '2568': parsed };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return { '2568': [] };
  });

  const [internalControlsByYear, setInternalControlsByYear] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_internal_controls_by_year');
      if (saved) return JSON.parse(saved);
      const old = localStorage.getItem('ia_internal_controls');
      if (old) {
        return { '2568': JSON.parse(old) };
      }
    } catch (e) {
      console.error(e);
    }
    return { '2568': initialInternalControls };
  });

  const [lpaIndicatorsByYear, setLpaIndicatorsByYear] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_lpa_indicators_by_year');
      if (saved) return JSON.parse(saved);
      const old = localStorage.getItem('ia_lpa_indicators');
      if (old) {
        return { '2568': JSON.parse(old) };
      }
    } catch (e) {
      console.error(e);
    }
    return { '2568': initialLpaIndicators };
  });

  const [auditCharterByYear, setAuditCharterByYear] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_audit_charter_by_year');
      if (saved) return JSON.parse(saved);
      const old = localStorage.getItem('ia_audit_charter');
      if (old) {
        return { '2568': JSON.parse(old) };
      }
    } catch (e) {
      console.error(e);
    }
    return { '2568': initialAuditCharter };
  });

  // Audit Universe Risk Assessment state isolated by fiscal year
  const [auditUniverseByYear, setAuditUniverseByYear] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_audit_universe_by_year');
      if (saved) return JSON.parse(saved);
      return { '2568': defaultAuditUniverse };
    } catch (e) {
      console.error(e);
      return { '2568': defaultAuditUniverse };
    }
  });

  const [knowledgeBase, setKnowledgeBase] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_knowledge_base');
      return saved ? JSON.parse(saved) : initialKnowledgeBase;
    } catch {
      return initialKnowledgeBase;
    }
  });

  // Save year-scoped states to localStorage
  useEffect(() => {
    localStorage.setItem('ia_org_profile', JSON.stringify(orgProfile));
  }, [orgProfile]);

  useEffect(() => {
    localStorage.setItem('ia_annual_plans_by_year', JSON.stringify(annualPlansByYear));
  }, [annualPlansByYear]);

  useEffect(() => {
    localStorage.setItem('ia_working_papers_by_year', JSON.stringify(workingPapersByYear));
  }, [workingPapersByYear]);

  useEffect(() => {
    localStorage.setItem('ia_risk_assessments_by_year', JSON.stringify(riskAssessmentsByYear));
  }, [riskAssessmentsByYear]);

  useEffect(() => {
    localStorage.setItem('ia_internal_controls_by_year', JSON.stringify(internalControlsByYear));
  }, [internalControlsByYear]);

  useEffect(() => {
    localStorage.setItem('ia_lpa_indicators_by_year', JSON.stringify(lpaIndicatorsByYear));
  }, [lpaIndicatorsByYear]);

  useEffect(() => {
    localStorage.setItem('ia_audit_charter_by_year', JSON.stringify(auditCharterByYear));
  }, [auditCharterByYear]);

  useEffect(() => {
    localStorage.setItem('ia_audit_universe_by_year', JSON.stringify(auditUniverseByYear));
  }, [auditUniverseByYear]);

  // Dynamic getters & setters for the currently selected fiscal year
  const auditUniverse = auditUniverseByYear[selectedYear] || defaultAuditUniverse;
  const setAuditUniverse = (updaterOrValue) => {
    setAuditUniverseByYear((prev) => {
      const current = prev[selectedYear] || defaultAuditUniverse;
      const updated = typeof updaterOrValue === 'function' ? updaterOrValue(current) : updaterOrValue;
      return { ...prev, [selectedYear]: updated };
    });
  };

  const annualPlans = annualPlansByYear[selectedYear] || [];
  const setAnnualPlans = (updaterOrValue) => {
    setAnnualPlansByYear((prev) => {
      const current = prev[selectedYear] || [];
      const updated = typeof updaterOrValue === 'function' ? updaterOrValue(current) : updaterOrValue;
      return { ...prev, [selectedYear]: updated };
    });
  };

  const workingPapers = workingPapersByYear[selectedYear] || initialWorkingPapers;
  const setWorkingPapers = (updaterOrValue) => {
    setWorkingPapersByYear((prev) => {
      const current = prev[selectedYear] || initialWorkingPapers;
      const updated = typeof updaterOrValue === 'function' ? updaterOrValue(current) : updaterOrValue;
      return { ...prev, [selectedYear]: updated };
    });
  };

  const riskAssessments = riskAssessmentsByYear[selectedYear] || [];
  const setRiskAssessments = (updaterOrValue) => {
    setRiskAssessmentsByYear((prev) => {
      const current = prev[selectedYear] || [];
      const updated = typeof updaterOrValue === 'function' ? updaterOrValue(current) : updaterOrValue;
      return { ...prev, [selectedYear]: updated };
    });
  };

  const internalControls = internalControlsByYear[selectedYear] || initialInternalControls;
  const setInternalControls = (updaterOrValue) => {
    setInternalControlsByYear((prev) => {
      const current = prev[selectedYear] || initialInternalControls;
      const updated = typeof updaterOrValue === 'function' ? updaterOrValue(current) : updaterOrValue;
      return { ...prev, [selectedYear]: updated };
    });
  };

  const lpaIndicators = lpaIndicatorsByYear[selectedYear] || initialLpaIndicators;
  const setLpaIndicators = (updaterOrValue) => {
    setLpaIndicatorsByYear((prev) => {
      const current = prev[selectedYear] || initialLpaIndicators;
      const updated = typeof updaterOrValue === 'function' ? updaterOrValue(current) : updaterOrValue;
      return { ...prev, [selectedYear]: updated };
    });
  };

  const auditCharter = auditCharterByYear[selectedYear] || initialAuditCharter;
  const setAuditCharter = (updaterOrValue) => {
    setAuditCharterByYear((prev) => {
      const current = prev[selectedYear] || initialAuditCharter;
      const updated = typeof updaterOrValue === 'function' ? updaterOrValue(current) : updaterOrValue;
      return { ...prev, [selectedYear]: updated };
    });
  };

  // Actions
  const handleSaveProfile = (newProfile) => {
    setOrgProfile(newProfile);
  };

  const handleAddYear = (newYear) => {
    if (!fiscalYears.includes(newYear)) {
      const updated = [...fiscalYears, newYear].sort();
      setFiscalYears(updated);
      setSelectedYear(newYear);
    }
  };

  const handleDeleteYear = (yearToDelete) => {
    if (fiscalYears.length <= 1) return;
    const updated = fiscalYears.filter((y) => y !== yearToDelete);
    setFiscalYears(updated);
    if (selectedYear === yearToDelete) {
      setSelectedYear(updated[0]);
    }
  };

  // Reset to clean blank state (clears all sample records completely)
  const handleResetData = () => {
    setAnnualPlansByYear({ [selectedYear]: [] });
    setWorkingPapersByYear({ [selectedYear]: initialWorkingPapers });
    setRiskAssessmentsByYear({ [selectedYear]: [] });
    setInternalControlsByYear({ [selectedYear]: initialInternalControls });
    setLpaIndicatorsByYear({ [selectedYear]: initialLpaIndicators });
    setAuditCharterByYear({ [selectedYear]: initialAuditCharter });
    setAuditUniverseByYear({ [selectedYear]: defaultAuditUniverse });
    setOrgProfile(initialOrgProfile);
    localStorage.removeItem('ia_annual_plans_by_year');
    localStorage.removeItem('ia_working_papers_by_year');
    localStorage.removeItem('ia_risk_assessments_by_year');
    localStorage.removeItem('ia_internal_controls_by_year');
    localStorage.removeItem('ia_lpa_indicators_by_year');
    localStorage.removeItem('ia_audit_charter_by_year');
    localStorage.removeItem('ia_audit_universe_by_year');
    localStorage.removeItem('ia_org_profile');
    localStorage.removeItem('ia_annual_plans');
    localStorage.removeItem('ia_working_papers');
    localStorage.removeItem('ia_risk_assessments');
    localStorage.removeItem('ia_internal_controls');
    localStorage.removeItem('ia_lpa_indicators');
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const data = {
      version: '2.2',
      exportedAt: new Date().toISOString(),
      orgProfile,
      fiscalYears,
      selectedYear,
      auditUniverseByYear,
      annualPlansByYear,
      workingPapersByYear,
      riskAssessmentsByYear,
      internalControlsByYear,
      lpaIndicatorsByYear,
      auditCharterByYear
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IA-OS_Backup_${orgProfile.name || 'อปท'}_${selectedYear}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportBackup = (data) => {
    if (data.orgProfile) setOrgProfile(data.orgProfile);
    if (data.fiscalYears) setFiscalYears(data.fiscalYears);
    if (data.auditUniverseByYear) setAuditUniverseByYear(data.auditUniverseByYear);
    else if (data.auditUniverse) setAuditUniverseByYear({ [selectedYear]: data.auditUniverse });
    if (data.annualPlansByYear) setAnnualPlansByYear(data.annualPlansByYear);
    else if (data.annualPlans) setAnnualPlansByYear({ [selectedYear]: data.annualPlans });
    if (data.workingPapersByYear) setWorkingPapersByYear(data.workingPapersByYear);
    else if (data.workingPapers) setWorkingPapersByYear({ [selectedYear]: data.workingPapers });
    if (data.riskAssessmentsByYear) setRiskAssessmentsByYear(data.riskAssessmentsByYear);
    else if (data.riskAssessments) setRiskAssessmentsByYear({ [selectedYear]: data.riskAssessments });
    if (data.internalControlsByYear) setInternalControlsByYear(data.internalControlsByYear);
    else if (data.internalControls) setInternalControlsByYear({ [selectedYear]: data.internalControls });
    if (data.lpaIndicatorsByYear) setLpaIndicatorsByYear(data.lpaIndicatorsByYear);
    else if (data.lpaIndicators) setLpaIndicatorsByYear({ [selectedYear]: data.lpaIndicators });
    if (data.auditCharterByYear) setAuditCharterByYear(data.auditCharterByYear);
    else if (data.auditCharter) setAuditCharterByYear({ [selectedYear]: data.auditCharter });
  };

  if (!session) {
    return <LoginView onLogin={(username) => setSession(getSession() || { username })} />;
  }

  const handleLogout = () => {
    authLogout();
    setSession(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-800 flex flex-col font-sans">
      <Header
        orgProfile={orgProfile}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        fiscalYears={fiscalYears}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((v) => !v)}
        username={session.username}
        onLogout={handleLogout}
        onChangePassword={() => setShowChangePassword(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}

      {showSettings && (
        <ProfileSettingsModal
          orgProfile={orgProfile}
          onSaveProfile={handleSaveProfile}
          fiscalYears={fiscalYears}
          onAddYear={handleAddYear}
          onDeleteYear={handleDeleteYear}
          onResetData={handleResetData}
          onExportBackup={handleExportBackup}
          onImportBackup={handleImportBackup}
          onClose={() => setShowSettings(false)}
        />
      )}

      <div className="flex-1 flex overflow-hidden">
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} planCount={annualPlans.length} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/70 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardView
                key={`dashboard-${selectedYear}`}
                orgProfile={orgProfile}
                selectedYear={selectedYear}
                annualPlans={annualPlans}
                workingPapers={workingPapers}
                lpaIndicators={lpaIndicators}
                riskAssessments={riskAssessments}
                setCurrentTab={setCurrentTab}
                setSelectedWp={setSelectedWp}
                onOpenSettings={() => setShowSettings(true)}
              />
            )}

            {currentTab === 'audit-risk' && (
              <AuditRiskView
                key={`audit-risk-${selectedYear}`}
                selectedYear={selectedYear}
                orgProfile={orgProfile}
                auditUniverse={auditUniverse}
                setAuditUniverse={setAuditUniverse}
                annualPlans={annualPlans}
                setAnnualPlans={setAnnualPlans}
                setCurrentTab={setCurrentTab}
              />
            )}

            {currentTab === 'planning' && (
              <PlanningView
                key={`planning-${selectedYear}`}
                selectedYear={selectedYear}
                auditCharter={auditCharter}
                annualPlans={annualPlans}
                setAnnualPlans={setAnnualPlans}
                riskAssessments={riskAssessments}
                setRiskAssessments={setRiskAssessments}
                orgProfile={orgProfile}
              />
            )}

            {currentTab === 'execution' && (
              <ExecutionView
                key={`execution-${selectedYear}`}
                selectedYear={selectedYear}
                workingPapers={workingPapers}
                setWorkingPapers={setWorkingPapers}
                selectedWp={selectedWp}
                setSelectedWp={setSelectedWp}
                orgProfile={orgProfile}
              />
            )}

            {currentTab === 'reporting' && (
              <ReportingView
                key={`reporting-${selectedYear}`}
                selectedYear={selectedYear}
                orgProfile={orgProfile}
                annualPlans={annualPlans}
                workingPapers={workingPapers}
              />
            )}

            {currentTab === 'control-risk' && (
              <ControlRiskView
                key={`control-risk-${selectedYear}`}
                selectedYear={selectedYear}
                internalControls={internalControls}
                riskAssessments={riskAssessments}
                orgProfile={orgProfile}
              />
            )}

            {currentTab === 'lpa' && (
              <LpaView
                key={`lpa-${selectedYear}`}
                selectedYear={selectedYear}
                lpaIndicators={lpaIndicators}
                orgProfile={orgProfile}
              />
            )}

            {currentTab === 'knowledge' && (
              <KnowledgeView
                key={`knowledge-${selectedYear}`}
                selectedYear={selectedYear}
                knowledgeBase={knowledgeBase}
                orgProfile={orgProfile}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
