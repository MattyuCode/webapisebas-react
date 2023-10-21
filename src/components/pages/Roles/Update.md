  const UpdateRole = async () => {
    debugger;
    try {
      const resquestOptions = {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idRol: idEditar,
          nombreRol: form.nombre_rol,
        }),
      };
      const response = await fetch(
        `${API_Services}/api/CRUD/ModificarRol`,
        resquestOptions
      );

      if (response.ok) {
        const data = await response.json();
        // Swal.fire({
        //   icon: "success",
        //   title: "Rol guardado",
        //   text: "Rol registrado correctamente",
        // });
        console.log(data);

        setRol((prevRol) => [...prevRol, data]);
        setForm({ nombre_rol: "" });
      } else {
        console.error("Ocurrió un error al guardar el rol.");
      }
    } catch (error) {
      console.error(error);
    }
  };
