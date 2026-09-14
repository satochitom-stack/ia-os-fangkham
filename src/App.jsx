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
import { getSession, logout as authLogout } from './utils/auth';

import {
  initialOrgProfile,
  initialAuditCharter,
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

  // Navigation & Fiscal Year State
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedYear, setSelectedYear] = useState('2568');
  const [selectedWp, setSelectedWp] = useState('WP-KTB-01');

  // Persistent States
  const [orgProfile, setOrgProfile] = useState(() => {
    const saved = localStorage.getItem('ia_org_profile');
    return saved ? JSON.parse(saved) : initialOrgProfile;
  });

  const [auditCharter, setAuditCharter] = useState(() => {
    const saved = localStorage.getItem('ia_audit_charter');
    return saved ? JSON.parse(saved) : initialAuditCharter;
  });

  const [annualPlans, setAnnualPlans] = useState(() => {
    const saved = localStorage.getItem('ia_annual_plans');
    return saved ? JSON.parse(saved) : initialAnnualPlans;
  });

  const [workingPapers, setWorkingPapers] = useState(() => {
    const saved = localStorage.getItem('ia_working_papers');
    return saved ? JSON.parse(saved) : initialWorkingPapers;
  });

  const [riskAssessments, setRiskAssessments] = useState(() => {
    const saved = localStorage.getItem('ia_risk_assessments');
    return saved ? JSON.parse(saved) : initialRiskAssessments;
  });

  const [internalControls, setInternalControls] = useState(() => {
    const saved = localStorage.getItem('ia_internal_controls');
    return saved ? JSON.parse(saved) : initialInternalControls;
  });

  const [lpaIndicators, setLpaIndicators] = useState(() => {
    const saved = localStorage.getItem('ia_lpa_indicators');
    return saved ? JSON.parse(saved) : initialLpaIndicators;
  });

  const [knowledgeBase, setKnowledgeBase] = useState(() => {
    const saved = localStorage.getItem('ia_knowledge_base');
    return saved ? JSON.parse(saved) : initialKnowledgeBase;
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
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((v) => !v)}
        username={session.username}
        onLogout={handleLogout}
        onChangePassword={() => setShowChangePassword(true)}
      />

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
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
