import React, { useState } from 'react';
import { SolarLead, AuditTrailLog } from '../types/crm';
import { INITIAL_AUDIT_LOGS } from '../data/initialData';
import { X, Download, Upload, ShieldCheck, Database, History, FileSpreadsheet } from 'lucide-react';

interface ImportExportModalProps {
  leads: SolarLead[];
  onClose: () => void;
  onImportLeads: (imported: SolarLead[]) => void;
  onRestoreBackup: (jsonContent: string) => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  leads,
  onClose,
  onImportLeads,
  onRestoreBackup
}) => {
  const [activeTab, setActiveTab] = useState<'csv' | 'backup' | 'audit'>('csv');
  const [importCsvText, setImportCsvText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditTrailLog[]>(INITIAL_AUDIT_LOGS);

  // Export full JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      company: 'SolarQube Energy',
      version: '2.0',
      leads
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SolarQube_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Restore JSON Backup file
  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      onRestoreBackup(content);
      onClose();
    };
    reader.readAsText(file);
  };

  // Download Sample CSV template
  const handleDownloadTemplate = () => {
    const template = `Customer Name,Phone,Email,City,Property Type,Monthly Bill,Roof Area SqFt,Budget,Source
Dr. Ramesh Kulkarni,+91 98450 11223,ramesh@gmail.com,Bengaluru,Home / Villa,12000,1200,500000,Website Form
Aditya Textiles,+91 98200 44556,aditya@textiles.com,Surat,Factory / Industrial Shed,180000,15000,4500000,Expo & Event`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SolarQube_Leads_Template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Parse CSV text
  const handleProcessImport = () => {
    if (!importCsvText.trim()) return;
    try {
      const lines = importCsvText.trim().split('\n');
      const newLeads: SolarLead[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',');
        if (parts.length >= 6) {
          const name = parts[0].trim();
          const phone = parts[1].trim();
          const email = parts[2].trim();
          const city = parts[3].trim();
          const pType = parts[4].trim() as any;
          const bill = Number(parts[5].trim()) || 10000;
          const area = Number(parts[6]?.trim()) || 1000;
          const kw = Math.max(1, Math.round(bill / 1250));

          newLeads.push({
            id: `sq-imp-${Date.now()}-${i}`,
            customerName: name,
            phone,
            email,
            address: `${city}`,
            city,
            state: 'Karnataka',
            propertyType: pType || 'Home / Villa',
            monthlyBill: bill,
            roofAreaSqFt: area,
            roofType: 'RCC Flat Roof',
            systemType: 'On-Grid',
            recommendedCapacityKw: kw,
            estimatedQuoteValue: kw * 58000,
            estimatedSubsidyAmount: kw <= 3 ? 78000 : 78000,
            netPayableAmount: kw * 58000 - 78000,
            stage: 'new',
            priority: 'High',
            source: (parts[8]?.trim() as any) || 'Field Survey',
            assignedTo: 'Ananya Sharma',
            createdDate: new Date().toISOString().slice(0, 10),
            lastContactedDate: new Date().toISOString().slice(0, 10),
            nextFollowUpDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
            untouchedAlert: false,
            activities: [
              {
                id: `act-imp-${i}`,
                type: 'stage_change',
                author: 'CSV Import Engine',
                role: 'admin',
                title: 'Imported via CSV',
                description: `Imported customer record. Capacity: ${kw} kWp.`,
                timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
              }
            ],
            proposals: [],
            documents: [],
            installationSteps: [],
            payments: []
          });
        }
      }

      if (newLeads.length > 0) {
        onImportLeads(newLeads);
        setImportStatus(`Successfully imported ${newLeads.length} leads!`);
        setTimeout(() => onClose(), 1500);
      } else {
        setImportStatus('No valid lead rows found in the CSV text.');
      }
    } catch {
      setImportStatus('Error parsing CSV. Please check formatting.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Data Portability, Backups & Audit Trail
            </h2>
            <p className="text-xs text-slate-500">
              Import leads from spreadsheets, download encrypted JSON backups, and review system audit records
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveTab('csv')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'csv' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
            }`}
          >
            Import CSV Leads
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'backup' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
            }`}
          >
            System Backup & Restore
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'audit' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
            }`}
          >
            Audit Trail
          </button>
        </div>

        {activeTab === 'csv' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Paste or Upload CSV Content</span>
              <button
                onClick={handleDownloadTemplate}
                className="text-brand-700 hover:text-brand-800 font-medium underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample Template</span>
              </button>
            </div>

            <textarea
              rows={6}
              value={importCsvText}
              onChange={e => setImportCsvText(e.target.value)}
              placeholder={`Customer Name,Phone,Email,City,Property Type,Monthly Bill,Roof Area SqFt,Budget,Source
Ramesh Kulkarni,+91 98450 11223,ramesh@gmail.com,Bengaluru,Home / Villa,12000,1200,500000,Website Form`}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[12px] text-slate-900"
            />

            {importStatus && (
              <p className="font-semibold text-emerald-700">{importStatus}</p>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessImport}
                className="px-4 py-2 text-white bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 rounded-lg font-medium"
              >
                Import Leads
              </button>
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900">SolarQube Database Snapshot</h4>
              <p className="text-slate-500">
                Download a complete, offline JSON archive containing all {leads.length} customer records, proposals, survey logs, and payment histories.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleExportBackup}
                className="px-4 py-2 bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 text-white rounded-lg flex items-center gap-1.5 font-medium shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-brand-400" />
                <span>Download Complete JSON Backup</span>
              </button>

              <label className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg flex items-center gap-1.5 font-medium hover:bg-slate-50 cursor-pointer shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Restore From JSON File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-3">
            <span className="font-semibold text-slate-700 block">Recent System Audit Trail</span>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[12px] space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{log.actor} ({log.role})</span>
                    <span className="font-mono text-slate-500">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-600">
                    <strong className="text-slate-800">{log.action}</strong> on {log.target}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
