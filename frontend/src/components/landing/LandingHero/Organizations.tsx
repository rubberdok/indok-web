import OrganizationLink, { Organization } from "./OrganizationLink";

const organizations: Readonly<Organization[]> = [
  { name: "Janus", externalUrl: "https://www.januslinjeforening.no" },
  { name: "Bindeleddet", externalUrl: "https://www.bindeleddet.no" },
  { name: "ESTIEM", externalUrl: "https://sites.google.com/view/estiem-ntnu" },
  { name: "Indøk Kultur", internalUrl: "/about/organization?category=kultur" },
  { name: "Rubberdøk", internalUrl: "/about/organizations/rubberdok" },
  { name: "Hytteforeningen", internalUrl: "/about/organizations/hyttestyret" },
  { name: "Janus IF", internalUrl: "/about/organization?category=idrett" },
] as const;

const Organizations: React.FC = () => {
  return (
    <>
      {organizations.map((organization) => (
        <OrganizationLink organization={organization} key={organization.name} />
      ))}
    </>
  );
};

export default Organizations;
