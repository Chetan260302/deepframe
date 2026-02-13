import { createClient } from '@/utils/supabase/server'
import Navbar from './Navbar'

export default async function NavbarWrapper() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return <Navbar userEmail={user?.email} />
}
