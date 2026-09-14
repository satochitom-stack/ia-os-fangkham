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

  // Migration: Automatically purge old D:\ sample data from localStorage on first run of v2
  useEffect(() => {
    const cleanFlag = localStorage.getItem('ia_clean_v2');
    if (!cleanFlag) {
      // Remove old cached sample items
      localStorage.removeItem('ia_annual_plans');
      localStorage.removeItem('ia_working_papers');
      localStorage.removeItem('ia_risk_assessments');
      localStorage.removeItem('ia_internal_controls');
      localStorage.removeItem('ia_lpa_indicators');
      // If orgProfile contained previous sample names, clear it
      const savedProfile = localStorage.getItem('ia_org_profile');
      if (savedProfile && (savedProfile.includes('สุดารัตน์') || savedProfile.includes('ศุภมงคล'))) {
        localStorage.removeItem('ia_org_profile');
      }
      localStorage.setItem('ia_clean_v2', 'true');
    }
  }, []);

  // Fiscal Years Management
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

  // Persistent States
  const [orgProfile, setOrgProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_org_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If old sample name remains, return clean profile
        if (parsed.auditorName?.includes('สุดารัตน์') || parsed.auditorName?.includes('ศุภมงคล')) {
          return initialOrgProfile;
        }
        return parsed;
      }
      return initialOrgProfile;
    } catch {
      return initialOrgProfile;
    }
  });

  const [auditCharter, setAuditCharter] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_audit_charter');
      return saved ? JSON.parse(saved) : initialAuditCharter;
    } catch {
      return initialAuditCharter;
    }
  });

  const [annualPlans, setAnnualPlans] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_annual_plans');
      return saved ? JSON.parse(saved) : initialAnnualPlans;
    } catch {
      return initialAnnualPlans;
    }
  });

  const [workingPapers, setWorkingPapers] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_working_papers');
      return saved ? JSON.parse(saved) : initialWorkingPapers;
    } catch {
      return initialWorkingPapers;
    }
  });

  const [riskAssessments, setRiskAssessments] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_risk_assessments');
      return saved ? JSON.parse(saved) : initialRiskAssessments;
    } catch {
      return initialRiskAssessments;
    }
  });

  const [internalControls, setInternalControls] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_internal_controls');
      return saved ? JSON.parse(saved) : initialInternalControls;
    } catch {
      return initialInternalControls;
    }
  });

  const [lpaIndicators, setLpaIndicators] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_lpa_indicators');
      return saved ? JSON.parse(saved) : initialLpaIndicators;
    } catch {
      return initialLpaIndicators;
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

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('ia_org_profile', JSON.stringify(orgProfile));
  }, [orgProfile]);

  useEffect(() => {
    localStorage.setItem('ia_annual_plans', JSON.stringify(annualPlans));
  }, [annualPlans]);

  useEffect(() => {
    localStorage.setItem('ia_working_papers', JSON.stringify(workingPapers));
  }, [workingPapers]);

  useEffect(() => {
    localStorage.setItem('ia_risk_assessments', JSON.stringify(riskAssessments));
  }, [riskAssessments]);

  useEffect(() => {
    localStorage.setItem('ia_internal_controls', JSON.stringify(internalControls));
  }, [internalControls]);

  useEffect(() => {
    localStorage.setItem('ia_lpa_indicators', JSON.stringify(lpaIndicators));
  }, [lpaIndicators]);

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
    setAnnualPlans([]);
    setWorkingPapers(initialWorkingPapers);
    setRiskAssessments([]);
    setInternalControls(initialInternalControls);
    setLpaIndicators(initialLpaIndicators);
    setOrgProfile(initialOrgProfile);
    localStorage.removeItem('ia_annual_plans');
    localStorage.removeItem('ia_working_papers');
    localStorage.removeItem('ia_risk_assessments');
    localStorage.removeItem('ia_internal_controls');
    localStorage.removeItem('ia_lpa_indicators');
    localStorage.removeItem('ia_org_profile');
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      orgProfile,
      fiscalYears,
      annualPlans,
      workingPapers,
      riskAssessments,
      internalControls,
      lpaIndicators
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
    if (data.annualPlans) setAnnualPlans(data.annualPlans);
    if (data.workingPapers) setWorkingPapers(data.workingPapers);
    if (data.riskAssessments) setRiskAssessments(data.riskAssessments);
    if (data.internalControls) setInternalControls(data.internalControls);
    if (data.lpaIndicators) setLpaIndicators(data.lpaIndicators);
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
                orgProfile={orgProfile}
                annualPlans={annualPlans}
                workingPapers={workingPapers}
                lpaIndicators={lpaIndicators}
                riskAssessments={riskAssessments}
                setCurrentTab={setCurrentTab}
                setSelectedWp={setSelectedWp}
                onOpenSettings={() => setShowSettings(true)}
              />
            )}

            {currentTab === 'planning' && (
              <PlanningView
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
                workingPapers={workingPapers}
                setWorkingPapers={setWorkingPapers}
                selectedWp={selectedWp}
                setSelectedWp={setSelectedWp}
                orgProfile={orgProfile}
              />
            )}

            {currentTab === 'reporting' && (
              <ReportingView
                orgProfile={orgProfile}
                annualPlans={annualPlans}
                workingPapers={workingPapers}
              />
            )}

            {currentTab === 'control-risk' && (
              <ControlRiskView
                internalControls={internalControls}
                riskAssessments={riskAssessments}
                orgProfile={orgProfile}
              />
            )}

            {currentTab === 'lpa' && (
              <LpaView
                lpaIndicators={lpaIndicators}
                orgProfile={orgProfile}
              />
            )}

            {currentTab === 'knowledge' && (
              <KnowledgeView
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
