// "use client";
// import { useSession, signIn, signOut } from "next-auth/react";

// export default function Home() {
//   const { data: session } = useSession();


//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>Bienvenido a la Intranet</h1>

//       {!session ? (
//         <>
//           <p>Debes iniciar sesión para acceder a la intranet.</p>
//           <button onClick={() => signIn("azure-ad")}>Iniciar sesión con Microsoft</button>
//         </>
//       ) : (
//         <>
//           <p>Hola, {session.user.nombre} ({session.user.role})</p>
//           <button onClick={() => signOut()}>Cerrar sesión</button>
//         </>
//       )}
//     </div>
//   );
// }





// "use client";
// import { useSession, signIn, signOut } from "next-auth/react";
// import { useEffect, useState } from "react";

// export default function Home() {
//   const { data: session, update, status } = useSession();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (status === "authenticated" && session?.user?.nombre === "Sin nombre") {
//       update().finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, [session, update, status]);

//   if (loading) {
//     return <p>Cargando...</p>;
//   }

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>Bienvenido a la Intranet</h1>

//       {!session ? (
//         <>
//           <p>Debes iniciar sesión para acceder a la intranet.</p>
//           <button onClick={() => signIn("azure-ad")}>Iniciar sesión con Microsoft</button>
//         </>
//       ) : (
//         <>
//           <p>Hola, {session.user.nombre} ({session.user.role})</p>
//           <button onClick={() => signOut()}>Cerrar sesión</button>
//         </>
//       )}
//     </div>
//   );
// }







"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, update, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.nombre === "Sin nombre" || !session?.user?.nombre) {
        // Si acabamos de crear el usuario o no tenemos su nombre, actualizar la sesión
        update().finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session, update, status]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bienvenido a la Intranet</h1>

      {!session ? (
        <>
          <p>Debes iniciar sesión para acceder a la intranet.</p>
          <button onClick={() => signIn("azure-ad")}>Iniciar sesión con Microsoft</button>
        </>
      ) : (
        <>
          <p>Hola, {session.user.nombre} ({session.user.role})</p>
          <button onClick={() => signOut()}>Cerrar sesión</button>
        </>
      )}
    </div>
  );
}