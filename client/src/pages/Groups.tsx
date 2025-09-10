import GroupsTable from "@/components/component/Groups";
import SettlementsTable from "@/components/component/SettlementsOfUser";


const Groups = () => {
  return (
    <div className="w-[1150px] mx-auto space-y-4">
      <GroupsTable />
      <SettlementsTable />
    </div>
  );
};

export default Groups;
