import React, { useState } from 'react';
import { SolarLead, SiteSurveyData, UserRole } from '../types/crm';
import { TEAM_MEMBERS } from '../data/initialData';
import { IMAGES } from '../assets/images';
import { 
  Compass, 
  Camera, 
  Calendar, 
  CheckCircle2, 
  Layers, 
  MapPin, 
  Plus, 
  Upload, 
  AlertCircle,
  FileCheck,
  Eye
} from 'lucide-react';

interface SiteSurveyModuleProps {
  leads: SolarLead[];
  userRole: UserRole;
  onUpdateLeadSurvey: (leadId: string, survey: SiteSurveyData) => void;
}

export const SiteSurveyModule: React.FC<SiteSurveyModuleProps> = ({
  leads,
  userRole,
  onUpdateLeadSurvey
}) => {
  // Filter leads that have survey scheduled or are in survey/qualification stage
  const eligibleLeads = leads.filter(l => l.stage !== 'lost');
  const [selectedLeadId, setSelectedLeadId] = useState<string>(eligibleLeads[0]?.id || '');
  const activeLead = leads.find(l => l.id === selectedLeadId) || eligibleLeads[0];

  // Editable survey data
  const [survey, setSurvey] = useState<SiteSurveyData>(
    activeLead?.siteSurvey || {
      scheduledDate: new Date().toISOString().slice(0, 10),
      engineerName: 'Vikram Rao',
      status: 'Scheduled',
      roofLengthFt: 45,
      roofWidthFt: 30,
      usableAreaSqFt: activeLead?.roofAreaSqFt || 1200,
      tiltAngleDeg: 14,
      azimuthAngleDeg: 180,
      shadingAssessment: 'Nil (0-2%)',
      roofCondition: 'Excellent',
      meterType: 'Three Phase LT',
      sanctionedLoadKw: activeLead?.recommendedCapacityKw || 10,
      photos: [
        { id: 'p-init', url: IMAGES.residentialVilla, caption: 'Main terrace South-facing horizon', date: '2026-10-18' }
      ],
      notes: 'No tall obstacles. Parapet height 3.5ft. Recommended HDGI structure.'
    }
  );

  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  // Sync survey state when changing lead
  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    const l = leads.find(x => x.id === leadId);
    if (l?.siteSurvey) {
      setSurvey(l.siteSurvey);
    } else if (l) {
      setSurvey({
        scheduledDate: new Date().toISOString().slice(0, 10),
        engineerName: 'Vikram Rao',
        status: 'Scheduled',
        roofLengthFt: 40,
        roofWidthFt: 25,
        usableAreaSqFt: l.roofAreaSqFt,
        tiltAngleDeg: 13,
        azimuthAngleDeg: 180,
        shadingAssessment: 'Nil (0-2%)',
        roofCondition: 'Excellent',
        meterType: l.propertyType === 'Home / Villa' ? 'Three Phase LT' : 'HT 11kV',
        sanctionedLoadKw: l.recommendedCapacityKw,
        photos: [],
        notes: ''
      });
    }
  };

  const handleSave = () => {
    if (!activeLead) return;
    onUpdateLeadSurvey(activeLead.id, survey);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleAttachPhoto = () => {
    const newP = {
      id: `p-${Date.now()}`,
      url: IMAGES.commercialRooftop,
      caption: newPhotoCaption.trim() || 'Roof structural anchor test photo',
      date: new Date().toISOString().slice(0, 10)
    };
    setSurvey({
      ...survey,
      photos: [...survey.photos, newP]
    });
    setNewPhotoCaption('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Site Survey & 3D Shadow Audit Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Schedule engineer visits, record roof structural dimensions, upload field photos, and verify DISCOM meter feasibility
          </p>
        </div>

        {/* Lead Picker */}
        <div className="flex items-center gap-2 bg-white dark:bg-[#0e1432] p-2 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap">Project:</span>
          <select
            value={selectedLeadId}
            onChange={e => handleSelectLead(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white font-medium"
          >
            {eligibleLeads.map(l => (
              <option key={l.id} value={l.id}>
                {l.customerName} ({l.recommendedCapacityKw} kWp · {l.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Site survey data and structural audit saved successfully!</span>
          </span>
        </div>
      )}

      {activeLead && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Survey Form & Engineering Specs */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 bg-white dark:bg-[#0e1432] rounded-xl border border-slate-200 dark:border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-brand-500" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Physical Roof & Electrical Feasibility Data
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Survey Status:</span>
                  <select
                    value={survey.status}
                    onChange={e => setSurvey({ ...survey, status: e.target.value as any })}
                    className="px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-semibold text-slate-800 dark:text-slate-100"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed & Verified</option>
                  </select>
                </div>
              </div>

              {/* Schedule and Engineer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Survey Date</label>
                  <input
                    type="date"
                    value={survey.scheduledDate}
                    onChange={e => setSurvey({ ...survey, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Assigned Site Engineer</label>
                  <select
                    value={survey.engineerName}
                    onChange={e => setSurvey({ ...survey, engineerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                  >
                    {TEAM_MEMBERS.map(m => (
                      <option key={m.name} value={m.name}>
                        {m.name} ({m.title})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Shading Assessment</label>
                  <select
                    value={survey.shadingAssessment}
                    onChange={e => setSurvey({ ...survey, shadingAssessment: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Nil (0-2%)">Nil (0-2%) - Optimal</option>
                    <option value="Low (<5%)">Low (&lt;5%)</option>
                    <option value="Moderate (5-15%)">Moderate (5-15%)</option>
                    <option value="Severe (>15%)">Severe (&gt;15%)</option>
                  </select>
                </div>
              </div>

              {/* Roof dimensions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Roof Length (ft)</label>
                  <input
                    type="number"
                    value={survey.roofLengthFt}
                    onChange={e => setSurvey({ ...survey, roofLengthFt: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Roof Width (ft)</label>
                  <input
                    type="number"
                    value={survey.roofWidthFt}
                    onChange={e => setSurvey({ ...survey, roofWidthFt: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Tilt Angle (°)</label>
                  <input
                    type="number"
                    value={survey.tiltAngleDeg}
                    onChange={e => setSurvey({ ...survey, tiltAngleDeg: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Azimuth Angle (°)</label>
                  <input
                    type="number"
                    value={survey.azimuthAngleDeg}
                    onChange={e => setSurvey({ ...survey, azimuthAngleDeg: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Electrical specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Utility Meter Type</label>
                  <select
                    value={survey.meterType}
                    onChange={e => setSurvey({ ...survey, meterType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Single Phase LT">Single Phase LT</option>
                    <option value="Three Phase LT">Three Phase LT</option>
                    <option value="HT 11kV">HT 11kV Transformer</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Sanctioned Load (kW)</label>
                  <input
                    type="number"
                    value={survey.sanctionedLoadKw}
                    onChange={e => setSurvey({ ...survey, sanctionedLoadKw: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Roof Condition</label>
                  <select
                    value={survey.roofCondition}
                    onChange={e => setSurvey({ ...survey, roofCondition: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Needs Reinforcement">Needs Reinforcement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1 text-xs">
                  Engineer's Shading & Structural Notes
                </label>
                <textarea
                  rows={3}
                  value={survey.notes}
                  onChange={e => setSurvey({ ...survey, notes: e.target.value })}
                  placeholder="Record tree proximity, parapet shadow times, AC cable duct length, and ladder access..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSave}
                  className="px-5 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Save Survey Measurements
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Site Photos & CAD Blueprint */}
          <div className="lg:col-span-4 space-y-6">
            {/* CAD Layout Blueprint Card */}
            <div className="p-4 bg-slate-900 dark:bg-[#0a0f2a] dark:border dark:border-slate-700 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-brand-400 font-bold uppercase tracking-wider text-[12px] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>3D CAD Array Layout</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  {survey.tiltAngleDeg}° Tilt · {survey.azimuthAngleDeg}° Azimuth
                </span>
              </div>
              <div className="rounded-lg overflow-hidden border border-slate-700/80">
                <img
                  src={IMAGES.technicalBlueprint}
                  alt="CAD Solar Array Layout"
                  className="w-full h-36 object-cover"
                />
              </div>
              <p className="text-[12px] text-slate-300 leading-tight">
                Simulated 3D array spacing prevents inter-row shadow losses from 09:00 to 16:30.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-[#0e1432] rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-brand-500" />
                  <span>Site & Roof Photos ({survey.photos.length})</span>
                </h3>
              </div>

              {/* Photos List */}
              <div className="space-y-3">
                {survey.photos.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">No photos attached yet.</p>
                ) : (
                  survey.photos.map(p => (
                    <div key={p.id} className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                      <img src={p.url} alt={p.caption} className="w-full h-32 object-cover" />
                      <div className="p-2 text-xs flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="font-medium truncate">{p.caption}</span>
                        <span className="font-mono text-[12px] text-slate-500 dark:text-slate-400">{p.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Photo Input */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="Photo caption (e.g. Parapet height)..."
                  value={newPhotoCaption}
                  onChange={e => setNewPhotoCaption(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                />
                <button
                  onClick={handleAttachPhoto}
                  className="w-full py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-medium rounded flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  <span>Attach Field Survey Photo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
