import { DEFAULT_LIMIT } from "@/components/vesp/VespTable/constants"
import { VespTableData } from "@/components/vesp/VespTable/types"
import { apiGet } from "@/lib/api"
import { withServerAuth } from "@/lib/api/with-server-auth"
import { VespProduct } from "@/types"

export default async function Page() {
  const initialData = await apiGet<VespTableData<VespProduct>>(
    'products',
    {
      limit: DEFAULT_LIMIT,
    },
  )
  return (
    <>
      Contacts
    </>
  )
}
