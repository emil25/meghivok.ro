import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Utensils, 
  Music, 
  Plus, 
  Trash2, 
  Download, 
  Send, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Mail,
  Phone
} from 'lucide-react';
import { InvitationData, GuestRsvp } from '../types/invitation';
import { getRsvpsForInvitation, deleteRsvp, addRsvp } from '../utils/storage';
import { formatHungarianShortDate } from '../utils/calendar';

interface RsvpDashboardProps {
  invitation: InvitationData;
  onOpenInviteEditor: () => void;
  onOpenShareModal: () => void;
}

export const RsvpDashboard: React.FC<RsvpDashboardProps> = ({
  invitation,
  onOpenInviteEditor,
  onOpenShareModal,
}) => {
  const [rsvps, setRsvps] = useState<GuestRsvp[]>(() => getRsvpsForInvitation(invitation.id));
  const [filterStatus, setFilterStatus] = useState<'all' | 'attending' | 'declined'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New guest manual input state
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newAdults, setNewAdults] = useState(2);
  const [newChildren, setNewChildren] = useState(0);
  const [newAttendance, setNewAttendance] = useState<'attending' | 'declined'>('attending');
  const [newDiet, setNewDiet] = useState('Normál');
  const [newSong, setNewSong] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const refreshRsvps = () => {
    setRsvps(getRsvpsForInvitation(invitation.id));
  };

  const handleDelete = (id: string) => {
    deleteRsvp(id);
    refreshRsvps();
  };

  const handleAddManualGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    addRsvp({
      invitationId: invitation.id,
      guestName: newGuestName.trim(),
      email: newGuestEmail.trim(),
      phone: newGuestPhone.trim(),
      attendance: newAttendance,
      adultsCount: newAttendance === 'attending' ? newAdults : 0,
      childrenCount: newAttendance === 'attending' ? newChildren : 0,
      dietaryRequirements: newDiet.trim(),
      songRequest: newSong.trim(),
      message: newMessage.trim(),
    });

    setNewGuestName('');
    setNewGuestEmail('');
    setNewGuestPhone('');
    setNewAdults(2);
    setNewChildren(0);
    setNewDiet('Normál');
    setNewSong('');
    setNewMessage('');
    setIsAddModalOpen(false);
    refreshRsvps();
  };

  const handleExportCsv = () => {
    const headers = ['Név', 'Státusz', 'Felnőttek', 'Gyermekek', 'Telefon', 'Email', 'Ételigény', 'Zenekérés', 'Üzenet', 'Dátum'];
    const rows = rsvps.map(r => [
      `"${r.guestName.replace(/"/g, '""')}"`,
      r.attendance === 'attending' ? 'Részt vesz' : 'Nem vesz részt',
      r.adultsCount,
      r.childrenCount,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.dietaryRequirements || '').replace(/"/g, '""')}"`,
      `"${(r.songRequest || '').replace(/"/g, '""')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      r.createdAt,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `vendeglista-${invitation.slug || 'esemeny'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Aggregated calculations
  const attendingList = rsvps.filter(r => r.attendance === 'attending');
  const declinedList = rsvps.filter(r => r.attendance === 'declined');

  const totalAdults = attendingList.reduce((acc, curr) => acc + (curr.adultsCount || 0), 0);
  const totalChildren = attendingList.reduce((acc, curr) => acc + (curr.childrenCount || 0), 0);
  const totalPeople = totalAdults + totalChildren;

  // Filtered guests
  const filteredGuests = rsvps.filter(r => {
    if (filterStatus !== 'all' && r.attendance !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.guestName.toLowerCase().includes(q);
      const matchPhone = (r.phone || '').toLowerCase().includes(q);
      const matchEmail = (r.email || '').toLowerCase().includes(q);
      const matchDiet = (r.dietaryRequirements || '').toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchEmail && !matchDiet) return false;
    }
    return true;
  });

  // Extract special diets
  const specialDiets = attendingList.filter(
    r => r.dietaryRequirements && r.dietaryRequirements.toLowerCase() !== 'normál' && r.dietaryRequirements.trim() !== ''
  );

  // Extract song requests
  const songsList = attendingList.filter(r => r.songRequest && r.songRequest.trim() !== '');

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Esemény:</span>
            <span className="font-semibold text-stone-800">{invitation.names}</span>
            <span aria-hidden="true">·</span>
            <span>{invitation.title}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Vendéglista & RSVP Kezelő Pult
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Vendég Hozzáadása</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Meghívó Link Küldése</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={rsvps.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel / CSV Export</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">
            Összes Visszajelzés
          </p>
          <p className="text-3xl font-bold font-mono tabular-nums text-stone-900">
            {rsvps.length}
          </p>
          <p className="text-xs text-stone-400 mt-1">Család / Meghívott egység</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs">
          <p className="text-xs font-medium text-emerald-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Részt vesz (Létszám)</span>
          </p>
          <p className="text-3xl font-bold font-mono tabular-nums text-emerald-800">
            {totalPeople} <span className="text-sm font-normal text-stone-500">fő</span>
          </p>
          <p className="text-xs text-stone-500 mt-1">
            {totalAdults} felnőtt · {totalChildren} gyermek
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <UserX className="w-3.5 h-3.5 text-stone-400" />
            <span>Nem tud jönni</span>
          </p>
          <p className="text-3xl font-bold font-mono tabular-nums text-stone-700">
            {declinedList.length} <span className="text-sm font-normal text-stone-500">visszajelzés</span>
          </p>
          <p className="text-xs text-stone-400 mt-1">Akadályoztatva</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs">
          <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Utensils className="w-3.5 h-3.5" />
            <span>Különleges Diéta</span>
          </p>
          <p className="text-3xl font-bold font-mono tabular-nums text-amber-900">
            {specialDiets.length} <span className="text-sm font-normal text-stone-500">igény</span>
          </p>
          <p className="text-xs text-stone-500 mt-1">Vegetáriánus, glutén- stb.</p>
        </div>
      </div>

      {/* Guest Table & Interactive Filter */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {/* Search & Filter bar */}
        <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterStatus === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Összes ({rsvps.length})
            </button>
            <button
              onClick={() => setFilterStatus('attending')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterStatus === 'attending' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Ott lesznek ({attendingList.length})
            </button>
            <button
              onClick={() => setFilterStatus('declined')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterStatus === 'declined' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Nem jönnek ({declinedList.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Vendég keresése..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Vendég Neve</th>
                <th className="py-3 px-4">Részvétel</th>
                <th className="py-3 px-4 text-center">Felnőtt</th>
                <th className="py-3 px-4 text-center">Gyermek</th>
                <th className="py-3 px-4">Ételérzékenység & Menü</th>
                <th className="py-3 px-4">Elérhetőség</th>
                <th className="py-3 px-4">Üzenet & Zene</th>
                <th className="py-3 px-4 text-right">Művelet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    Nincs a feltételeknek megfelelő vendég a listában.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      {guest.guestName}
                    </td>

                    <td className="py-3.5 px-4">
                      {guest.attendance === 'attending' ? (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Ott lesz</span>
                        </span>
                      ) : (
                        <span className="text-stone-500 font-medium flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Lemondta</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono tabular-nums">
                      {guest.adultsCount}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono tabular-nums">
                      {guest.childrenCount}
                    </td>

                    <td className="py-3.5 px-4 text-stone-700 max-w-xs">
                      {guest.dietaryRequirements || 'Normál'}
                    </td>

                    <td className="py-3.5 px-4 text-stone-500 space-y-0.5">
                      {guest.phone && (
                        <div className="flex items-center gap-1 text-[11px]">
                          <Phone className="w-3 h-3 text-stone-400" />
                          <span>{guest.phone}</span>
                        </div>
                      )}
                      {guest.email && (
                        <div className="flex items-center gap-1 text-[11px]">
                          <Mail className="w-3 h-3 text-stone-400" />
                          <span>{guest.email}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-stone-600 max-w-xs">
                      {guest.songRequest && (
                        <p className="text-[11px] text-amber-800 font-medium flex items-center gap-1 mb-0.5">
                          <Music className="w-3 h-3 shrink-0" />
                          <span className="truncate">{guest.songRequest}</span>
                        </p>
                      )}
                      {guest.message && (
                        <p className="text-[11px] text-stone-500 italic truncate" title={guest.message}>
                          "{guest.message}"
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(guest.id)}
                        className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors"
                        title="Törlés"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Highlights Section: Song requests and Diets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Diets list */}
        <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs">
          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-amber-800" />
            <span>Különleges Menük a Vendéglátónak</span>
          </h3>
          {specialDiets.length === 0 ? (
            <p className="text-xs text-stone-400">Nincs rögzített speciális ételigény.</p>
          ) : (
            <div className="space-y-2">
              {specialDiets.map((d) => (
                <div key={d.id} className="p-2.5 bg-stone-50 rounded-lg text-xs flex justify-between">
                  <span className="font-semibold text-stone-800">{d.guestName}</span>
                  <span className="text-amber-900 font-medium">{d.dietaryRequirements}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Songs list */}
        <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs">
          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Music className="w-4 h-4 text-amber-800" />
            <span>Vendégek Kívánságdalai (DJ Lista)</span>
          </h3>
          {songsList.length === 0 ? (
            <p className="text-xs text-stone-400">Még nem érkezett be zenekérés.</p>
          ) : (
            <div className="space-y-2">
              {songsList.map((s) => (
                <div key={s.id} className="p-2.5 bg-stone-50 rounded-lg text-xs flex justify-between">
                  <span className="text-stone-800 font-medium">🎵 {s.songRequest}</span>
                  <span className="text-stone-400 text-[11px]">{s.guestName}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Manual Guest Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-4">
              Vendég Manuális Rögzítése
            </h3>
            <form onSubmit={handleAddManualGuest} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Vendég vagy Család Neve *
                </label>
                <input
                  type="text"
                  required
                  placeholder="pl. Kiss Ferenc és neje"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="text"
                    placeholder="0740..."
                    value={newGuestPhone}
                    onChange={(e) => setNewGuestPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@..."
                    value={newGuestEmail}
                    onChange={(e) => setNewGuestEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Részvétel</label>
                  <select
                    value={newAttendance}
                    onChange={(e) => setNewAttendance(e.target.value as any)}
                    className="w-full px-2 py-2 border border-stone-300 rounded-lg"
                  >
                    <option value="attending">Ott lesz</option>
                    <option value="declined">Nem jön</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Felnőttek</label>
                  <input
                    type="number"
                    min="0"
                    value={newAdults}
                    onChange={(e) => setNewAdults(Number(e.target.value))}
                    className="w-full px-2 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Gyerekek</label>
                  <input
                    type="number"
                    min="0"
                    value={newChildren}
                    onChange={(e) => setNewChildren(Number(e.target.value))}
                    className="w-full px-2 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Ételérzékenység</label>
                <input
                  type="text"
                  placeholder="Normál / Vegetáriánus / Gluténmentes..."
                  value={newDiet}
                  onChange={(e) => setNewDiet(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Kívánságdal</label>
                <input
                  type="text"
                  placeholder="Kedvenc szám címe"
                  value={newSong}
                  onChange={(e) => setNewSong(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900"
                >
                  Mégse
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800"
                >
                  Mentés a listába
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
