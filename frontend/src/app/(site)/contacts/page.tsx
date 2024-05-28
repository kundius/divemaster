import { DEFAULT_LIMIT } from "@/components/lib/ApiTable/constants"
import { ApiTableData } from "@/components/lib/ApiTable/types"
import { apiGet } from "@/lib/api"
import { withServerAuth } from "@/lib/api/with-server-auth"
import { ProductEntity } from "@/types"

export default async function Page() {
  const initialData = await apiGet<ApiTableData<ProductEntity>>(
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
