import Spread, { type SpreadDatum } from './Spread';

/*
 * Every figure below is read out of the running sim's own source rather than
 * asserted: `KM = 10` sets one kilometre to ten world units horizontally,
 * Jeju sits at (-42, 449) from the Seoul origin, and Hallasan's 1,947 m
 * renders as 97 units — which is five times what true scale would give it.
 *
 * That last one is the detail worth printing. A peer reading this page will
 * want to know which parts are honest and which are staged, and saying so
 * costs nothing.
 */
const DATA: SpreadDatum[] = [
  { label: 'Route', value: 'Seoul → Hallasan' },
  { label: 'Distance', value: '451 km' },
  { label: 'Horizontal', value: 'True scale' },
  { label: 'Vertical', value: 'Exaggerated ×5' },
  { label: 'Summit', value: 'Hallasan, 1,947 m' },
  { label: 'Engine', value: 'Three.js r160' },
];

export default function FlyerSpread() {
  return (
    <Spread
      id="flyer"
      title="Flyer Fable"
      thesis="A first-person flight the length of South Korea, over terrain built at true
        geographic scale rather than to taste. Everything renders in the browser from a
        single static page — no build step, no bundler, one self-hosted copy of Three.js."
      data={DATA}
      href="/flyer-fable/"
      linkLabel="Open Flyer Fable"
    />
  );
}
