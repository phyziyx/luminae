import { GetServerSideProps } from 'next';
import { Agency } from '@prisma/client';
import prisma from '@/lib/db';

type AgencyDetailsProps = {
  agencies: Agency[];
};

const AgencyDetails = ({ agencies }: AgencyDetailsProps) => {
  return (
    <div>
      <h1>Agencies</h1>
      <ul>
        {agencies.map((agency) => (
          <li key={agency.id}>
            <h2>{agency.name}</h2>
            <p>{agency.companyEmail}</p>
            <p>{agency.city}, {agency.state}, {agency.country}</p>
            {/* Add more agency details as necessary */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch agencies from Prisma
  const agencies = await prisma.agency.findMany();

  return {
    props: {
      agencies,
    },
  };
};

export default AgencyDetails;
