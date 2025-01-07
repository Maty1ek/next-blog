// We need to write "use server" in the files, that may be used in client components, though the functions must be only on the server.
// If we dont use "use server", the server components by default, might become client components.
// "use server"
// it means, thet components must be run only in server components
import "server-only"

export default async function myFunction() {
    console.log('My function');
}