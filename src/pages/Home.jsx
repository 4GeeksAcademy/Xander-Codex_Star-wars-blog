import SectionInfo from "../components/SectionInfo";

export const Home = () => {
  return (
    <div className=" text-dark">
      <SectionInfo entity="people"   title="Characters" />
      <SectionInfo entity="vehicles" title="Vehicles" />
      <SectionInfo entity="planets"  title="Planets" />
    </div>
  );
};