// src/pages/admin/Settings.tsx (original, unchanged)
import { ChangeEvent, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  Percent,
  Users,
  Save,
  RefreshCw,
  AlertTriangle,
  CreditCard
} from 'lucide-react';
import Input from '../../components/common/Input';

interface SettingsState {
  siteName: string;
  siteEmail: string;
  supportEmail: string;
  phone: string;
  address: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  sellerCommission: number;
  contractorCommission: number;
  rentalCommission: number;
  minCommission: number;
  maxCommission: number;
  paymentGateway: string;
  payoutCycle: string;
  minPayout: number;
  maxPayout: number;
  holdPeriod: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
  notifyNewSeller: boolean;
  notifyNewOrder: boolean;
  notifyPayout: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  ipWhitelist: boolean;
  allowRegistration: boolean;
  requireApproval: boolean;
}

const defaultSettings: SettingsState = {
  siteName: 'Casa Terminal',
  siteEmail: 'admin@casaterminal.com',
  supportEmail: 'support@casaterminal.com',
  phone: '+91 xxxxx xxxxx',
  address: 'Mumbai, India',
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  currency: 'INR',
  sellerCommission: 5,
  contractorCommission: 8,
  rentalCommission: 10,
  minCommission: 2,
  maxCommission: 20,
  paymentGateway: 'razorpay',
  payoutCycle: 'weekly',
  minPayout: 1000,
  maxPayout: 500000,
  holdPeriod: 3,
  emailNotifications: true,
  pushNotifications: true,
  notifyNewSeller: true,
  notifyNewOrder: true,
  notifyPayout: true,
  twoFactorAuth: true,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  ipWhitelist: false,
  allowRegistration: true,
  requireApproval: true,
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'commission', name: 'Commission', icon: Percent },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'users', name: 'Users', icon: Users },
  ];

  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  const handleInputChange = (field: keyof SettingsState) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox'
      ? event.target.checked
      : event.target.type === 'number'
        ? Number(event.target.value)
        : event.target.value;

    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  const handleReset = () => setShowConfirmModal(true);
  const handleConfirmReset = () => {
    setSettings(defaultSettings);
    setShowConfirmModal(false);
    alert('Settings reset to defaults');
  };

  const renderCheckbox = (field: keyof SettingsState, label: string, description?: string) => (
    <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <input
        type="checkbox"
        checked={settings[field] as boolean}
        onChange={handleInputChange(field)}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-900 focus:ring-orange-500"
      />
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </label>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <Input label="Site Name" value={settings.siteName} onChange={handleInputChange('siteName')} />
            <Input label="Site Email" type="email" value={settings.siteEmail} onChange={handleInputChange('siteEmail')} />
            <Input label="Support Email" type="email" value={settings.supportEmail} onChange={handleInputChange('supportEmail')} />
            <Input label="Phone" value={settings.phone} onChange={handleInputChange('phone')} />
            <Input label="Address" value={settings.address} onChange={handleInputChange('address')} />
            <Input label="Timezone" value={settings.timezone} onChange={handleInputChange('timezone')} />
            <Input label="Date Format" value={settings.dateFormat} onChange={handleInputChange('dateFormat')} />
            <Input label="Currency" value={settings.currency} onChange={handleInputChange('currency')} />
          </div>
        );
      case 'commission':
        return (
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <Input label="Seller Commission (%)" type="number" value={settings.sellerCommission} onChange={handleInputChange('sellerCommission')} />
            <Input label="Contractor Commission (%)" type="number" value={settings.contractorCommission} onChange={handleInputChange('contractorCommission')} />
            <Input label="Rental Commission (%)" type="number" value={settings.rentalCommission} onChange={handleInputChange('rentalCommission')} />
            <Input label="Minimum Commission (%)" type="number" value={settings.minCommission} onChange={handleInputChange('minCommission')} />
            <Input label="Maximum Commission (%)" type="number" value={settings.maxCommission} onChange={handleInputChange('maxCommission')} />
          </div>
        );
      case 'payments':
        return (
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <Input label="Payment Gateway" value={settings.paymentGateway} onChange={handleInputChange('paymentGateway')} />
            <Input label="Payout Cycle" value={settings.payoutCycle} onChange={handleInputChange('payoutCycle')} />
            <Input label="Minimum Payout" type="number" value={settings.minPayout} onChange={handleInputChange('minPayout')} />
            <Input label="Maximum Payout" type="number" value={settings.maxPayout} onChange={handleInputChange('maxPayout')} />
            <Input label="Hold Period (days)" type="number" value={settings.holdPeriod} onChange={handleInputChange('holdPeriod')} />
          </div>
        );
      case 'notifications':
        return (
          <div className="grid gap-4 p-6">
            {renderCheckbox('emailNotifications', 'Email notifications', 'Send email alerts for new activity.')}
            {renderCheckbox('pushNotifications', 'Push notifications', 'Send push alerts to mobile devices.')}
            {renderCheckbox('notifyNewSeller', 'Notify new seller', 'Alert admins when a seller signs up.')}
            {renderCheckbox('notifyNewOrder', 'Notify new order', 'Alert admins when a new order is placed.')}
            {renderCheckbox('notifyPayout', 'Notify payout', 'Alert admins when payouts are processed.')}
          </div>
        );
      case 'security':
        return (
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            {renderCheckbox('twoFactorAuth', 'Two-factor authentication', 'Require an extra security step for sign in.')}
            <Input label="Session Timeout (minutes)" type="number" value={settings.sessionTimeout} onChange={handleInputChange('sessionTimeout')} />
            <Input label="Max Login Attempts" type="number" value={settings.maxLoginAttempts} onChange={handleInputChange('maxLoginAttempts')} />
            {renderCheckbox('ipWhitelist', 'IP whitelist', 'Restrict access to approved IP addresses.')}
          </div>
        );
      case 'users':
        return (
          <div className="grid gap-4 p-6">
            {renderCheckbox('allowRegistration', 'Allow registration', 'Enable new user signup on the platform.')}
            {renderCheckbox('requireApproval', 'Require approval', 'New users must be approved by an admin.')}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Use these controls to manage how users join and access the system.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div><h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2"><SettingsIcon className="w-6 h-6 sm:w-7 sm:h-7 text-orange-900" /> Settings</h1><p className="text-xs sm:text-sm text-gray-500 mt-1">Configure your platform preferences</p></div>
          <div className="flex items-center gap-2"><button onClick={handleReset} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"><RefreshCw className="w-4 h-4" /><span className="hidden sm:inline">Reset</span></button><button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-orange-900 text-white rounded-lg hover:bg-orange-500 text-sm disabled:opacity-50">{isSaving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Saving...</span></> : <><Save className="w-4 h-4" /><span>Save</span></>}</button></div>
        </div>

        <div className="border-b border-gray-200 mb-6 overflow-x-auto"><nav className="flex -mb-px space-x-4 sm:space-x-8 min-w-max">{tabs.map(tab => { const Icon = tab.icon; return (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-orange-900 text-orange-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><Icon className="w-4 h-4" />{tab.name}</button>); })}</nav></div>

        <div className="bg-white rounded-lg border border-gray-200">
          {renderTabContent()}
        </div>
      </div>

      <AnimatePresence>{showConfirmModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-lg shadow-xl max-w-md w-full"><div className="p-4 sm:p-6"><div className="flex items-center gap-3 text-red-500 mb-4"><AlertTriangle className="w-6 h-6" /><h2 className="text-lg font-semibold">Reset Settings?</h2></div><p className="text-sm text-gray-600 mb-6">This will reset all settings to default values. This action cannot be undone.</p><div className="flex gap-3"><button onClick={handleConfirmReset} className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 text-sm">Reset</button><button onClick={() => setShowConfirmModal(false)} className="flex-1 border border-gray-200 py-2 rounded-lg hover:bg-gray-50 text-sm">Cancel</button></div></div></motion.div></div>)}</AnimatePresence>
    </div>
  );
};

export default Settings;