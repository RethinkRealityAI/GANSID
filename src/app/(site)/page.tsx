import { Hero } from '@/components/v2/hero';
import { DisordersMarquee } from '@/components/sections/disorders-marquee';
import { NowBento } from '@/components/v2/now-bento';
import { Mission } from '@/components/v2/mission';
import { Pillars } from '@/components/v2/pillars';
import { Congress } from '@/components/v2/congress';
import { Learning } from '@/components/v2/learning';
import { Story } from '@/components/v2/story';
import { GetInvolved } from '@/components/v2/get-involved';
import { Newsletter } from '@/components/sections/newsletter';
import { ReviewDock } from '@/components/review/review-dock';

export default function HomePage() {
  return (
    <>
      <Hero />
      <DisordersMarquee />
      <Mission />
      <NowBento />
      <Pillars />
      <Congress />
      <Learning />
      <Story />
      <GetInvolved />
      <Newsletter />
      <ReviewDock />
    </>
  );
}
