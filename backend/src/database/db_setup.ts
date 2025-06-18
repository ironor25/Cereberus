import  {Client, Pool} from "pg";

const pgClient = new Pool({connectionString: "postgresql://neondb_owner:npg_Czef14rvkwlj@ep-blue-sea-a42byrww-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"})


export default pgClient;