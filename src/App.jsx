import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import PlanningView from './components/PlanningView';
import ExecutionView from './components/ExecutionView';
import ReportingView from './components/ReportingView';
import InternalControlView from './components/InternalControlView';
import RiskManagementView from './components/RiskManagementView';
import LpaView from './components/LpaView';
import KnowledgeView from './components/KnowledgeView';
import FormsView from './components/FormsView';
import LoginView from './components/LoginView';
import WelcomeView from './components/WelcomeView';
import ChangePasswordModal from './components/ChangePasswordModal';
import ProfileSettingsModal from './components/ProfileSettingsModal';
import AuditRiskView, { defaultAuditUniverse } from './components/AuditRiskView';
import EngagementPlanView from './components/EngagementPlanView';
import UserManagementView from './components/UserManagementView';
import TechnicalToolkitsView from './components/TechnicalToolkitsView';
import { INITIAL_ENGAGEMENT_PLANS } from './data/engagementPlanTemplates';
import { getSession, logout as authLogout, switchSessionTo, autoRepairDataLinkages } from './utils/auth';

import {
  initialOrgProfile,
  initialAuditCharter,
  initialFiscalYears,
  initialAnnualPlans,
  initialWorkingPapers,
  initialWorkingPapers2570,
  initialRiskAssessments,
  initialInternalControls,
  initialRiskManagement,
  initialLpaIndicators,
  initialKnowledgeBase
} from './data/initialData';

// Run auto-repair of department linkages and user accounts synchronously before state initialization
try {
  autoRepairDataLinkages();
} catch (e) {
  console.error(e);
}

export default function App() {
  // Authentication State (single-user, client-side session)
  const [session, setSession] = useState(() => getSession());
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Dark Mode State (Default to false for warm white-blue theme)
  const [darkMode, setDarkMode] = useState(() => {
    // Migration: ensure user resets to the new warm white-blue theme by default
    if (localStorage.getItem('ia_theme_white_blue_v2') !== '1') {
      localStorage.setItem('ia_theme_white_blue_v2', '1');
      localStorage.setItem('ia_dark_mode', '0');
      return false;
    }
    const saved = localStorage.getItem('ia_dark_mode');
    if (saved !== null) return saved === '1';
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('ia_dark_mode', darkMode ? '1' : '0');
  }, [darkMode]);

  // Migration: Synchronously ensure sample data from D:\ drive is completely purged
  const [fiscalYears, setFiscalYears] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_fiscal_years');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If stored fiscal years contain 2567 or only 2568, migrate to default ['2569', '2570']
          if (
            parsed.includes('2567') ||
            (parsed.length === 2 && parsed.includes('2567') && parsed.includes('2568')) ||
            (parsed.length === 1 && parsed[0] === '2568') ||
            (parsed.length === 4 && parsed.includes('2569') && parsed.includes('2570'))
          ) {
            return initialFiscalYears;
          }
          return parsed;
        }
      }
      return initialFiscalYears;
    } catch {
      return initialFiscalYears;
    }
  });

  useEffect(() => {
    localStorage.setItem('ia_fiscal_years', JSON.stringify(fiscalYears));
  }, [fiscalYears]);

  // Navigation & Fiscal Year State
  const [selectedYear, setSelectedYear] = useState('2569');
  const [currentTab, setCurrentTab] = useState('welcome');
  const [selectedWp, setSelectedWp] = useState('WP-KTB-01');
  const [activeToolkitTab, setActiveToolkitTab] = useState('factor-f');

  // Persistent States - Cleaned of D:\ sample data and synced with real Fang Kham profile
  const [orgProfile, setOrgProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_org_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialOrgProfile,
          ...parsed,
          name: parsed.name && !parsed.name.includes('...') ? parsed.name : initialOrgProfile.name,
          district: parsed.district && !parsed.district.includes('กุดข้าวปุ้น') ? parsed.district : initialOrgProfile.district,
          approverName: parsed.approverName || initialOrgProfile.approverName,
          palatName: parsed.palatName || initialOrgProfile.palatName,
          auditorName: parsed.auditorName && !parsed.auditorName.includes('สุดารัตน์') ? parsed.auditorName : initialOrgProfile.auditorName,
          auditorPosition: parsed.auditorPosition || initialOrgProfile.auditorPosition,
          fiscalYear: parsed.fiscalYear && (parsed.fiscalYear === '2569' || parsed.fiscalYear === '2570') ? parsed.fiscalYear : initialOrgProfile.fiscalYear
        };
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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed['2569'] && parsed['2568']) parsed['2569'] = parsed['2568'];
        return parsed;
      }
      const old = localStorage.getItem('ia_annual_plans');
      if (old) {
        const parsed = JSON.parse(old);
        if (Array.isArray(parsed)) {
          if (parsed.some((p) => p.title?.includes('ค่าเช่าบ้าน') || p.id === 'PLAN-68-01')) {
            return { '2569': [] };
          }
          return { '2569': parsed };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return { '2569': [] };
  });

  const [workingPapersByYear, setWorkingPapersByYear] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_working_papers_by_year');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed['2569'] && parsed['2568']) parsed['2569'] = parsed['2568'];
        if (!parsed['2570'] || parsed['2570'].length === 0) parsed['2570'] = initialWorkingPapers2570;
        return parsed;
      }
      const old = localStorage.getItem('ia_working_papers');
      if (old) {
        const parsed = JSON.parse(old);
        if (Array.isArray(parsed)) {
          return { '2569': parsed, '2570': initialWorkingPapers2570 };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return { '2569': initialWorkingPapers, '2570': initialWorkingPapers2570 };
  });

  const [riskAssessmentsByYear, setRiskAssessmentsByYear] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_risk_assessments_by_year');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed['2569'] && parsed['2568']) parsed['2569'] = parsed['2568'];
        return parsed;
      }
      const old = localStorage.getItem('ia_risk_assessments');
      if (old) {
        const parsed = JSON.parse(old);
        if (Array.isArray(parsed)) {
          if (parsed.some((r) => r.activity?.includes('KTB') || r.id === 'RISK-01')) {
            return { '2569': [] };
          }
          return { '2569': parsed };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return { '2569': [] };
  });

  const [internalControlsByYear, setInternalControlsByYear] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_internal_controls_by_year');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed['2569'] && parsed['2568']) parsed['2569'] = parsed['2568'];
        return parsed;
      }
      const old = localStorage.getItem('ia_internal_controls');
      if (old) {
        return { '2569': JSON.parse(old) };
      }
    } catch (e) {
      console.error(e);
    }
    return { '2569': initialInternalControls };
  });

  const [riskManagementByYear, setRiskManagementByYear] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_risk_management_by_year');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed['2569'] && parsed['2568']) parsed['2569'] = parsed['2568'];
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return { '2569': initialRiskManagement, '2570': initialRiskManagement };
  });

  const [lpaIndicatorsByYear, setLpaIndicatorsByYear] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_lpa_indicators_by_year');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed['2569'] && parsed['2568']) parsed['2569'] = parsed['2568'];
        return parsed;
      }
      const old = localStorage.getItem('ia_lpa_indicators');
      if (old) {
        return { '2569': JSON.parse(old) };
      }
    } catch (e) {
      console.error(e);
    }
    return { '2569': initialLpaIndicators };
  });

  const [auditCharterByYear, setAuditCharterByYear] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_audit_charter_by_year');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed['2569'] && parsed['2568']) parsed['2569'] = parsed['2568'];
        return parsed;
      }
      const old = localStorage.getItem('ia_audit_charter');
      if (old) {
        return { '2569': JSON.parse(old) };
      }
    } catch (e) {
      console.error(e);
    }
    return { '2569': initialAuditCharter };
  });

  // Audit Universe Risk Assessment state isolated by fiscal year
  const [auditUniverseByYear, setAuditUniverseByYear] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_audit_universe_by_year');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed['2569']) {
          parsed['2569'] = parsed['2568'] || defaultAuditUniverse;
        }
        // Automatically upgrade to real Fang Kham SAO 21 activities
        if (parsed['2569'] && (parsed['2569'].length < 21 || parsed['2569'][0]?.activity?.includes('การจัดเก็บภาษี'))) {
          parsed['2569'] = defaultAuditUniverse;
          localStorage.setItem('ia_audit_universe_by_year', JSON.stringify(parsed));
        }
        return parsed;
      }
      return { '2569': defaultAuditUniverse, '2570': defaultAuditUniverse };
    } catch (e) {
      console.error(e);
      return { '2569': defaultAuditUniverse, '2570': defaultAuditUniverse };
    }
  });

  // Audit Engagement Plans state (ว 614) isolated by fiscal year
  const [engagementPlansByYear, setEngagementPlansByYear] = useState(() => {
    try {
      const saved = localStorage.getItem('ia_engagement_plans_by_year');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed['2569']) {
          parsed['2569'] = parsed['2568'] || INITIAL_ENGAGEMENT_PLANS;
        }
        return parsed;
      }
      return { '2569': INITIAL_ENGAGEMENT_PLANS, '2570': INITIAL_ENGAGEMENT_PLANS };
    } catch (e) {
      console.error(e);
      return { '2569': INITIAL_ENGAGEMENT_PLANS, '2570': INITIAL_ENGAGEMENT_PLANS };
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
    localStorage.setItem('ia_risk_management_by_year', JSON.stringify(riskManagementByYear));
  }, [riskManagementByYear]);

  useEffect(() => {
    localStorage.setItem('ia_lpa_indicators_by_year', JSON.stringify(lpaIndicatorsByYear));
  }, [lpaIndicatorsByYear]);

  useEffect(() => {
    localStorage.setItem('ia_audit_charter_by_year', JSON.stringify(auditCharterByYear));
  }, [auditCharterByYear]);

  useEffect(() => {
    localStorage.setItem('ia_audit_universe_by_year', JSON.stringify(auditUniverseByYear));
  }, [auditUniverseByYear]);

  useEffect(() => {
    localStorage.setItem('ia_engagement_plans_by_year', JSON.stringify(engagementPlansByYear));
  }, [engagementPlansByYear]);

  const reloadDataFromStorage = () => {
    try {
      const au = localStorage.getItem('ia_audit_universe_by_year');
      if (au) setAuditUniverseByYear(JSON.parse(au));
      const ap = localStorage.getItem('ia_annual_plans_by_year');
      if (ap) setAnnualPlansByYear(JSON.parse(ap));
      const ep = localStorage.getItem('ia_engagement_plans_by_year');
      if (ep) setEngagementPlansByYear(JSON.parse(ep));
      const wp = localStorage.getItem('ia_working_papers_by_year');
      if (wp) setWorkingPapersByYear(JSON.parse(wp));
      const rm = localStorage.getItem('ia_risk_management_by_year');
      if (rm) setRiskManagementByYear(JSON.parse(rm));
    } catch (e) {
      console.error(e);
    }
  };

  // Dynamic getters & setters for the currently selected fiscal year
  const auditUniverse = auditUniverseByYear[selectedYear] || defaultAuditUniverse;
  const setAuditUniverse = (updaterOrValue) => {
    setAuditUniverseByYear((prev) => {
      const current = prev[selectedYear] || defaultAuditUniverse;
      const updated = typeof updaterOrValue === 'function' ? updaterOrValue(current) : updaterOrValue;
      return { ...prev, [selectedYear]: updated };
    });
  };

  const engagementPlans = engagementPlansByYear[selectedYear] || INITIAL_ENGAGEMENT_PLANS;
  const setEngagementPlans = (updaterOrValue) => {
    setEngagementPlansByYear((prev) => {
      const current = prev[selectedYear] || INITIAL_ENGAGEMENT_PLANS;
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

  const defaultWpForYear = selectedYear === '2570' ? initialWorkingPapers2570 : initialWorkingPapers;
  const workingPapers = workingPapersByYear[selectedYear] || defaultWpForYear;
  const setWorkingPapers = (updaterOrValue) => {
    setWorkingPapersByYear((prev) => {
      const current = prev[selectedYear] || defaultWpForYear;
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

  const riskManagement = riskManagementByYear[selectedYear] || initialRiskManagement;
  const setRiskManagement = (updaterOrValue) => {
    setRiskManagementByYear((prev) => {
      const current = prev[selectedYear] || initialRiskManagement;
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
    setRiskManagementByYear({ [selectedYear]: initialRiskManagement });
    setLpaIndicatorsByYear({ [selectedYear]: initialLpaIndicators });
    setAuditCharterByYear({ [selectedYear]: initialAuditCharter });
    setAuditUniverseByYear({ [selectedYear]: defaultAuditUniverse });
    setEngagementPlansByYear({ [selectedYear]: INITIAL_ENGAGEMENT_PLANS });
    setOrgProfile(initialOrgProfile);
    localStorage.removeItem('ia_annual_plans_by_year');
    localStorage.removeItem('ia_working_papers_by_year');
    localStorage.removeItem('ia_risk_assessments_by_year');
    localStorage.removeItem('ia_internal_controls_by_year');
    localStorage.removeItem('ia_risk_management_by_year');
    localStorage.removeItem('ia_lpa_indicators_by_year');
    localStorage.removeItem('ia_audit_charter_by_year');
    localStorage.removeItem('ia_audit_universe_by_year');
    localStorage.removeItem('ia_engagement_plans_by_year');
    localStorage.removeItem('ia_org_profile');
    localStorage.removeItem('ia_annual_plans');
    localStorage.removeItem('ia_working_papers');
    localStorage.removeItem('ia_risk_assessments');
    localStorage.removeItem('ia_internal_controls');
    localStorage.removeItem('ia_risk_management');
    localStorage.removeItem('ia_lpa_indicators');
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const data = {
      version: '2.3',
      exportedAt: new Date().toISOString(),
      orgProfile,
      fiscalYears,
      selectedYear,
      auditUniverseByYear,
      engagementPlansByYear,
      annualPlansByYear,
      workingPapersByYear,
      riskAssessmentsByYear,
      internalControlsByYear,
      riskManagementByYear,
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
    if (data.engagementPlansByYear) setEngagementPlansByYear(data.engagementPlansByYear);
    else if (data.engagementPlans) setEngagementPlansByYear({ [selectedYear]: data.engagementPlans });
    if (data.annualPlansByYear) setAnnualPlansByYear(data.annualPlansByYear);
    else if (data.annualPlans) setAnnualPlansByYear({ [selectedYear]: data.annualPlans });
    if (data.workingPapersByYear) setWorkingPapersByYear(data.workingPapersByYear);
    else if (data.workingPapers) setWorkingPapersByYear({ [selectedYear]: data.workingPapers });
    if (data.riskAssessmentsByYear) setRiskAssessmentsByYear(data.riskAssessmentsByYear);
    else if (data.riskAssessments) setRiskAssessmentsByYear({ [selectedYear]: data.riskAssessments });
    if (data.internalControlsByYear) setInternalControlsByYear(data.internalControlsByYear);
    else if (data.internalControls) setInternalControlsByYear({ [selectedYear]: data.internalControls });
    if (data.riskManagementByYear) setRiskManagementByYear(data.riskManagementByYear);
    else if (data.riskManagement) setRiskManagementByYear({ [selectedYear]: data.riskManagement });
    if (data.lpaIndicatorsByYear) setLpaIndicatorsByYear(data.lpaIndicatorsByYear);
    else if (data.lpaIndicators) setLpaIndicatorsByYear({ [selectedYear]: data.lpaIndicators });
    if (data.auditCharterByYear) setAuditCharterByYear(data.auditCharterByYear);
    else if (data.auditCharter) setAuditCharterByYear({ [selectedYear]: data.auditCharter });
  };

  // Route Guard: Ensure non-admin users only access allowed menu tabs
  useEffect(() => {
    if (!session) return;
    if (session.role === 'admin') return;
    const allowed = [...(session.permissions || ['dashboard']), 'welcome'];
    if (!allowed.includes(currentTab)) {
      setCurrentTab(allowed[0] || 'dashboard');
    }
  }, [session, currentTab]);

  if (!session) {
    return (
      <WelcomeView
        session={null}
        onLogin={(sess) => {
          setSession(sess || getSession());
          setCurrentTab('dashboard');
        }}
        onEnterDashboard={() => setCurrentTab('dashboard')}
      />
    );
  }

  if (currentTab === 'welcome') {
    return (
      <WelcomeView
        session={session}
        onLogin={(sess) => setSession(sess || getSession())}
        onEnterDashboard={() => setCurrentTab('dashboard')}
      />
    );
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
        session={session}
        onLogout={handleLogout}
        onChangePassword={() => setShowChangePassword(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenUsersManagement={() => setCurrentTab('users')}
        onOpenWelcome={() => setCurrentTab('welcome')}
      />

      {/* Impersonate / Department Preview Banner (แสดงเฉพาะเมื่อ ADMIN กำลังกดทดสอบมุมมองเท่านั้น) */}
      {session?.isImpersonating && (
        <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 text-slate-950 px-4 py-2 text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm z-20">
          <div className="flex items-center space-x-2">
            <span>👁️ <strong>โหมดทดสอบมุมมอง (Admin Preview):</strong> คุณกำลังดูหน้าจอในฐานะ {session.displayName || session.username} ({session.department})</span>
            <span className="text-[10px] bg-slate-950/20 px-2 py-0.5 rounded-full font-mono">
              (แสดงเฉพาะ {session.permissions?.length || 0} เมนูที่ได้รับอนุญาต)
            </span>
          </div>
          <button
            onClick={() => {
              const adminSess = switchSessionTo('admin', false);
              setSession(adminSess);
              setCurrentTab('users');
            }}
            className="bg-slate-950 hover:bg-slate-900 text-amber-300 border border-amber-300/40 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto shadow-sm"
          >
            <span>✕ ออกจากโหมดทดสอบ (กลับสู่ ADMIN)</span>
          </button>
        </div>
      )}

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
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          session={session}
          planCount={annualPlans.length}
          activeToolkitTab={activeToolkitTab}
          setActiveToolkitTab={setActiveToolkitTab}
        />

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

            {currentTab === 'engagement-plan' && (
              <EngagementPlanView
                key={`engagement-plan-${selectedYear}`}
                selectedYear={selectedYear}
                orgProfile={orgProfile}
                auditUniverse={auditUniverse}
                annualPlans={annualPlans}
                engagementPlans={engagementPlans}
                setEngagementPlans={setEngagementPlans}
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

            {currentTab === 'audit-toolkits' && (
              <TechnicalToolkitsView
                key={`toolkits-${selectedYear}`}
                selectedYear={selectedYear}
                workingPapers={workingPapers}
                setWorkingPapers={setWorkingPapers}
                setSelectedWp={setSelectedWp}
                setCurrentTab={setCurrentTab}
                initialTool={activeToolkitTab}
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

            {(currentTab === 'internal-control' || currentTab === 'control-risk') && (
              <InternalControlView
                key={`internal-control-${selectedYear}`}
                selectedYear={selectedYear}
                internalControls={internalControls}
                setInternalControls={setInternalControls}
                orgProfile={orgProfile}
              />
            )}

            {currentTab === 'risk-management' && (
              <RiskManagementView
                key={`risk-management-${selectedYear}`}
                selectedYear={selectedYear}
                riskManagement={riskManagement}
                setRiskManagement={setRiskManagement}
                orgProfile={orgProfile}
                session={session}
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

            {currentTab === 'forms' && (
              <FormsView
                key={`forms-${selectedYear}`}
                setCurrentTab={setCurrentTab}
                selectedYear={selectedYear}
                orgProfile={orgProfile}
                session={session}
                riskManagement={riskManagement}
              />
            )}

            {currentTab === 'users' && session?.role === 'admin' && (
              <UserManagementView
                currentSession={session}
                onSwitchSession={(newSession) => {
                  setSession(newSession);
                  if (newSession.role !== 'admin') {
                    setCurrentTab('dashboard');
                  }
                }}
                onRefreshUser={() => {
                  setSession(getSession());
                  reloadDataFromStorage();
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
