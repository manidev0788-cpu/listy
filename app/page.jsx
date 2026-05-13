import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { HappeningCities } from "@/components/HappeningCities";
import { ShowBestOfBusiness } from "@/components/ShowBestOfBusiness";
import { JoinCommunity } from "@/components/JoinCommunity";
import { Testimonials } from "@/components/Testimonials";
import { SubscribeSection } from "@/components/SubscribeSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <HappeningCities />
      <ShowBestOfBusiness />
      <JoinCommunity />
      <Testimonials />
      <SubscribeSection />
    </>
  );
}
