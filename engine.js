// PayAnchor engine - salary negotiation math and scripts (no DOM)
(function (root) {
  'use strict';

  function roundNice(n) { return Math.round(n / 500) * 500; }

  // leverage: 1 = standard, 2 = strong (competing offer / rare skills), 3 = exceptional
  function plan(opts) {
    var target = opts.target, current = opts.current || 0;
    if (!(target > 0)) throw new Error('target must be positive');
    var bump = 0.08 + 0.04 * Math.max(1, Math.min(3, opts.leverage || 1));
    var anchor = roundNice(target * (1 + bump));
    var floor = roundNice(Math.max(current * 1.03, target * 0.94));
    if (floor >= anchor) floor = roundNice(anchor * 0.9);
    var pct = null;
    if (opts.marketHigh > opts.marketLow && opts.marketLow > 0) {
      pct = Math.round(100 * (target - opts.marketLow) / (opts.marketHigh - opts.marketLow));
      pct = Math.max(0, Math.min(100, pct));
    }
    var upliftVsCurrent = current > 0 ? Math.round(1000 * (target - current) / current) / 10 : null;
    return { anchor: anchor, target: target, floor: floor, marketPct: pct, upliftVsCurrent: upliftVsCurrent };
  }

  // How to respond to an offer, given the plan.
  function respond(offer, p) {
    if (!(offer > 0)) throw new Error('offer must be positive');
    if (offer < p.floor) {
      var c1 = roundNice(p.target * 1.05);
      return { scenario: 'below-floor', verdict: 'Below your walk-away', counter: c1,
        why: offer.toLocaleString() + ' is under your floor of ' + p.floor.toLocaleString() + '. Counter near your anchor territory and be ready to walk.' };
    }
    if (offer < p.target) {
      var c2 = roundNice(Math.max(p.anchor, offer * 1.08));
      return { scenario: 'below-target', verdict: 'Workable but low', counter: c2,
        why: 'It clears your floor but misses the target. Counter at ' + c2.toLocaleString() + ' - you can settle in between.' };
    }
    if (offer < p.anchor) {
      var c3 = roundNice(Math.max(p.anchor, offer * 1.05));
      return { scenario: 'at-target', verdict: 'At your target', counter: c3,
        why: 'You can accept this. One light counter to ' + c3.toLocaleString() + ' costs nothing - most companies expect it.' };
    }
    return { scenario: 'above-anchor', verdict: 'Above your anchor', counter: offer,
      why: 'This beats the anchor you planned to open with. Say yes - and negotiate start date or perks if you want more.' };
  }

  var LEVERS = [
    'Signing bonus (one-time, easier to approve than base)',
    'Extra vacation days (often cheap for them, valuable for you)',
    'Remote / hybrid days in writing',
    'Equity or RSU top-up',
    'Learning budget or conference allowance',
    'Earlier salary review (6 months instead of 12)',
    'Title adjustment (sets up your next jump)',
    'Relocation support'
  ];

  function script(kind, p) {
    var a = p.anchor.toLocaleString(), t = p.target.toLocaleString(), f = p.floor.toLocaleString();
    switch (kind) {
      case 'stating':
        return 'Based on the scope we discussed and what I\'m seeing for this role in the market, I\'m targeting ' + a + '. I\'m confident the value I\'ll bring justifies it, and I\'m excited to find a number that works for both of us.';
      case 'lowball':
        return 'Thank you - I\'m genuinely excited about the role. The offer is below where I need to be; I was expecting something in the region of ' + a + ', based on [market data / my current scope]. Is there room to move closer to that?';
      case 'deflect':
        return 'I\'d rather focus on the value of this role than my current pay. My research puts this position between ' + f + ' and ' + a + ', and that\'s the range I\'m working from.';
      case 'time':
        return 'This is an important decision and I want to give it proper thought. Could I have until [day] to review the full package? I\'ll come back to you with a clear answer.';
      case 'closing':
        return 'If you can get to ' + t + ', I\'m ready to sign today. That number works for me, and I\'d love to stop negotiating and start contributing.';
      default:
        return '';
    }
  }

  var SCRIPT_KINDS = [
    { id: 'stating', label: 'Stating your number first' },
    { id: 'lowball', label: 'Responding to a low offer' },
    { id: 'deflect', label: 'Dodging "what do you earn now?"' },
    { id: 'time', label: 'Asking for time' },
    { id: 'closing', label: 'The closing move' }
  ];

  var api = {
    roundNice: roundNice,
    plan: plan,
    respond: respond,
    script: script,
    LEVERS: LEVERS,
    SCRIPT_KINDS: SCRIPT_KINDS
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AnchorEngine = api;
})(typeof self !== 'undefined' ? self : this);
