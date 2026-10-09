import React, { useState } from 'react';
import { X, Check, Heart, Music, Utensils, AlertCircle } from 'lucide-react';
import { InvitationData, GuestRsvp } from '../types/invitation';
import { addRsvp } from '../utils/storage';

interface RsvpModalProps {
  invitation: InvitationData;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: (rsvp: GuestRsvp) => void;
}

export const RsvpModal: React.FC<RsvpModalProps> = ({
  invitation,
  isOpen,
  onClose,
  onSubmitted,
}) => {
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attendance, setAttendance] = useState<'attending' | 'declined'>('attending');
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [dietType, setDietType] = useState<GuestRsvp['dietType']>('normal');
  const [dietaryRequirements, setDietaryRequirements] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError('Kérjük, add meg a nevedet!');
      return;
    }

    const created = addRsvp({
      invitationId: invitation.id,
      guestName: guestName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      attendance,
      adultsCount: attendance === 'attending' ? adultsCount : 0,
      childrenCount: attendance === 'attending' ? childrenCount : 0,
      dietaryRequirements: dietaryRequirements.trim() || (dietType === 'normal' ? 'Normál' : (dietType || '')),
      dietType,
      songRequest: songRequest.trim(),
      message: message.trim(),
    });

    setSubmitted(true);
    if (onSubmitted) {
      onSubmitted(created);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setGuestName('');
    setEmail('');
    setPhone('');
    setAttendance('attending');
    setDietaryRequirements('');
    setSongRequest('');
    setMessage('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Visszajelzés küldése (RSVP)
            </h3>
            <p className="text-xs text-stone-500">
              {invitation.names} · {invitation.title}
            </p>
          </div>
          <button
            onClick={resetForm}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-serif font-bold text-stone-900">
                Köszönjük a visszajelzést!
              </h4>
              <p className="text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
                {attendance === 'attending'
                  ? 'A válaszodat sikeresen rögzítettük. Nagyon várjuk, hogy együtt ünnepelhessünk ezen a különleges napon!'
                  : 'Sajnáljuk, hogy nem tudsz velünk lenni, de köszönjük, hogy jelezted felénk!'}
              </p>
              <div className="pt-4">
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
                >
                  Rendben, bezárás
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Attendance Choice */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Részt veszel az eseményen?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttendance('attending')}
                    className={`py-3 px-4 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                      attendance === 'attending'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Ott leszek! Örömmel megyek</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendance('declined')}
                    className={`py-3 px-4 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                      attendance === 'declined'
                        ? 'border-stone-800 bg-stone-100 text-stone-900 shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    <span>Sajnos nem tudok menni</span>
                  </button>
                </div>
              </div>

              {/* Guest Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Név vagy Család neve <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="pl. Kovács Péter és Katalin"
                  value={guestName}
                  onChange={(e) => {
                    setGuestName(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                />
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Telefonszám
                  </label>
                  <input
                    type="tel"
                    placeholder="pl. 0740 123 456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    E-mail cím
                  </label>
                  <input
                    type="email"
                    placeholder="pl. email@pelda.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>
              </div>

              {/* If attending: Headcount */}
              {attendance === 'attending' && (
                <>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        Felnőttek száma
                      </label>
                      <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                          className="px-3 py-2 bg-stone-50 hover:bg-stone-100 text-stone-600 text-sm font-semibold border-r border-stone-200"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center text-sm font-semibold font-mono tabular-nums">
                          {adultsCount} fő
                        </span>
                        <button
                          type="button"
                          onClick={() => setAdultsCount(adultsCount + 1)}
                          className="px-3 py-2 bg-stone-50 hover:bg-stone-100 text-stone-600 text-sm font-semibold border-l border-stone-200"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {invitation.allowChildren && (
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                          Gyermekek száma
                        </label>
                        <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                            className="px-3 py-2 bg-stone-50 hover:bg-stone-100 text-stone-600 text-sm font-semibold border-r border-stone-200"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center text-sm font-semibold font-mono tabular-nums">
                            {childrenCount} fő
                          </span>
                          <button
                            type="button"
                            onClick={() => setChildrenCount(childrenCount + 1)}
                            className="px-3 py-2 bg-stone-50 hover:bg-stone-100 text-stone-600 text-sm font-semibold border-l border-stone-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dietary Requirements */}
                  {invitation.allowDietary && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5" />
                        <span>Menü & Ételérzékenység</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
                        {[
                          { id: 'normal', label: 'Hagyományos' },
                          { id: 'vegetarian', label: 'Vegetáriánus' },
                          { id: 'gluten_free', label: 'Gluténmentes' },
                          { id: 'lactose_free', label: 'Laktózmentes' },
                          { id: 'vegan', label: 'Vegán' },
                          { id: 'other', label: 'Egyéb / Részlet' },
                        ].map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setDietType(d.id as any)}
                            className={`py-2 px-2 rounded-lg text-center border font-medium transition-all ${
                              dietType === d.id
                                ? 'bg-amber-50 border-amber-800 text-amber-900 font-semibold'
                                : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Pl. 1 fő vegetáriánus, dióallergia..."
                        value={dietaryRequirements}
                        onChange={(e) => setDietaryRequirements(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:border-amber-800"
                      />
                    </div>
                  )}

                  {/* Song Request */}
                  {invitation.allowSongRequest && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5" />
                        <span>Kívánságdal a DJ-nek</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Előadó és szám címe, amire biztosan táncolnál"
                        value={songRequest}
                        onChange={(e) => setSongRequest(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:border-amber-800"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" />
                  <span>Üzenet a vendéglátóknak</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Kedves jókívánság vagy megjegyzés..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:border-amber-800 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
                >
                  Visszajelzés Elküldése
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
