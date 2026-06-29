// ==========================================
// CONFIGURACIÓN GLOBAL
// ==========================================
const SHEET_ID = "1GOEcVSfAdxVqV7IHrWXJJWUAEtwo1vtER3__zBv-U4U";
const DRIVE_FOLDER_ID = "1n4tTRrHTtg6cDaVT2rtZo7q-Y6LB3VJN";

// ==========================================
// 1. ENRUTADOR PRINCIPAL (API GATEWAY)
// ==========================================

function doGet(e) {
  return ContentService.createTextOutput("API RegistraME V3 Online - Sistema Activo");
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    // --- AUTENTICACIÓN ---
    if(action === "login") return apiLogin(data);

    // --- DASHBOARD ---
    if(action === "getInitialData") return response(obtenerDatosDocente(data.email));

    // --- ADMIN ---
    if(action === "getUsers") return response(obtenerListaUsuarios());
    if(action === "createUser") return response(registrarNuevoUsuario(data.newEmail, data.tipo, data.nombre));
    if(action === "toggleUserStatus") return response(cambiarEstadoUsuario(data.id, data.nuevoEstado));

    // --- GESTIÓN INSTITUCIONAL ---
    if(action === "createInst") return response(crearInstitucion(data.email, data.nombre));
    if(action === "createSection") return response(guardarSeccion(data));
    if(action === "editSection") return response(actualizarSeccion(data));
    if(action === "deleteSection") return response(eliminarSeccion(data.id));

    // --- ESTUDIANTES ---
    if(action === "getStudents") return response(obtenerEstudiantes(data.idSeccion));
    if(action === "saveStudent") return response(guardarEstudiante(data));
    if(action === "deleteStudent") return response(eliminarEstudiante(data.id));
    if(action === "importStudents") return response(importarEstudiantesMasivo(data.idSeccion, data.lista));
    if(action === "moveStudent") return response(moverEstudianteDeSeccion(data.idEstudiante, data.idNuevaSeccion));

    // --- MATERIAS ---
    if(action === "getSubjects") return response(obtenerMaterias(data.idSeccion));
    if(action === "saveSubject") return response(guardarMateria(data));
    if(action === "deleteSubject") return response(eliminarMateria(data.id));

    // --- EVALUACIÓN ---
    if(action === "getIndicators") return response(obtenerIndicadores(data.idMateria, data.categoria));
    if(action === "saveIndicator") return response(guardarIndicador(data));
    if(action === "deleteIndicator") return response(eliminarIndicador(data.id));
    if(action === "getEvaluationData") return response(obtenerDatosEvaluacion(data.idSeccion, data.idIndicador));
    if(action === "saveGrades") return response(guardarCalificaciones(data));
    if(action === "pdfStudentReport") return response(generarPdfBoletaEstudiante(data.id));
    if(action === "pdfGrades") return response(generarPdfNotasMateria(data.id));

    // --- HORARIOS ---
    if(action === "saveConfigHorario") return response(guardarConfigHorario(data));
    if(action === "getConfigHorarios") return response(obtenerConfigHorarios(data.idSeccion));
    if(action === "delConfigHorario") return response(eliminarConfigHorario(data.id));
    if(action === "getMatrixAttendance") return response(obtenerMatrizAsistencia(data.idSeccion, data.idMateria, data.fIni, data.fFin));
    if(action === "saveMark") return response(guardarMarcaAsistencia(data));

    // --- ASISTENCIA ---
    if(action === "saveAttendance") return response(guardarAsistenciaMasiva(data));

    // --- PLANEAMIENTO (ESTO ERA LO QUE FALTABA) ---
    if(action === "savePlanning") return response(guardarPlaneamiento(data));
    if(action === "getPlanning") return response(obtenerPlaneamientosDocente(data.email));
    if(action === "pdfPlanning") return response(generarPdfPlaneamiento(data.id));
    if(action === "deletePlanning") return response(eliminarPlaneamiento(data.id));

    // --- BITÁCORAS ---
    if(action === "saveBitacora") return response(guardarBitacora(data));
    if(action === "getBitacoras") return response(obtenerBitacoras(data.email, data.idSeccion));
    if(action === "deleteBitacora") return response(eliminarBitacora(data.id));
    if(action === "closeBitacora") return response(cerrarBitacora(data.id));
    if(action === "countAlerts") return response(contarAlertas(data.email));
    if(action === "pdfBitacora") return response(generarPdfIncidencia(data.id));

    // --- MI AULA ---
    if(action === "saveLesson") return response(guardarLeccion(data));
    if(action === "getLessons") return response(obtenerLeccionesDocente(data.email));
    if(action === "pdfLesson") return response(generarPdfLeccion(data.id));
    if(action === "deleteLesson") return response(eliminarLeccion(data.id));

    // --- NUEVOS REPORTES ---
    if(action === "getStudentReport") return response(obtenerBoletaEstudiante(data.id));
    if(action === "pdfStudentReport") return response(generarPdfBoletaEstudiante(data.id));
    if(action === "getSubjectReport") return response(obtenerCuadroMateria(data.id));
    if(action === "obtenerReporteAuditoriaNotas") return response(obtenerReporteAuditoriaNotas(data.idIndicador));

    // --- ASISTENCIA ESTUDIANTE ---
    if(action === "getStudentAttendance") return response(obtenerAsistenciaEstudiante(data.idEstudiante, data.idMateria));

    // --- NUEVAS ACCIONES ---
    if(action === "toggleExempt") return response(toggleExemptStatus(data.id, data.status));
    if(action === "pdfStudentList") return response(generarPdfListaEstudiantes(data.id));

     // --- REPORTES SEA ---
    if(action === "getSEAReport") return response(obtenerDatosReporteSEA(data.id));

// --- INFORME AL HOGAR ---
    if(action === "bulkDownloadReport") return response(generarPdfMasivoBoletas(data));
    if(action === "sendBulkReport") return response(enviarReporteHogarMasivo(data));

    return response({status: "error", msg: "Acción desconocida: " + action});

  } catch (e) {
    return response({status: "error", msg: "Error Servidor: " + e.toString()});
  }
}

function response(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// 2. LÓGICA DE NEGOCIO (MODULES)
// ==========================================

function validarLogin(email, password) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("USUARIOS");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]).trim().toLowerCase() == String(email).trim().toLowerCase() &&
        String(data[i][3]).trim() == String(password).trim()) {

      const estado = data[i][7] ? String(data[i][7]).toUpperCase() : "ACTIVO";

      if (estado === "INACTIVO") {
        return { valid: false, reason: "LOCKED" };
      }

      return { valid: true, rol: data[i][4] };
    }
  }
  return { valid: false, reason: "WRONG_PASS" };
}

function obtenerDatosDocente(email) {
  let respuesta = { nombre: "Docente", secciones: [], instituciones: [] };
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);

    const idUsuarioRaw = obtenerIdUsuarioPorEmail(email);
    if (!idUsuarioRaw) return { error: "Usuario no encontrado" };
    const idUsuario = String(idUsuarioRaw).trim();

    const sheetUsers = ss.getSheetByName("USUARIOS");
    const dataUsers = sheetUsers.getDataRange().getValues();
    for(let i=1; i<dataUsers.length; i++) {
        if(String(dataUsers[i][0]).trim() == idUsuario) { respuesta.nombre = dataUsers[i][1]; break; }
    }

    const sheetInst = ss.getSheetByName("INSTITUCIONES");
    let mapaInst = {};
    if (sheetInst) {
      const dataInst = sheetInst.getDataRange().getValues();
      for (let i = 1; i < dataInst.length; i++) {
        if (String(dataInst[i][2]).trim() === idUsuario) {
          mapaInst[dataInst[i][0]] = dataInst[i][1];
          respuesta.instituciones.push({ id: dataInst[i][0], nombre: dataInst[i][1] });
        }
      }
    }

    const sheetSecc = ss.getSheetByName("SECCIONES");
    if (sheetSecc) {
      const dataSecc = sheetSecc.getDataRange().getValues();
      for (let i = 1; i < dataSecc.length; i++) {
        if (String(dataSecc[i][6]).trim() === idUsuario) {
          respuesta.secciones.push({
            id: dataSecc[i][0],
            idInstitucion: dataSecc[i][1],
            nombre: dataSecc[i][2],
            institucion: mapaInst[dataSecc[i][1]] || "Desconocida",
            anio: dataSecc[i][3],
            fechas: dataSecc[i][5],
            periodos: (dataSecc[i][4] || "0") + " Periodos"
          });
        }
      }
    }
    return respuesta;
  } catch (e) { return { error: e.toString() }; }
}

function guardarSeccion(form) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const idUsuario = obtenerIdUsuarioPorEmail(form.emailUsuario);
  if(!idUsuario) return { success: false, message: "Usuario no encontrado" };

  const sheetSecc = ss.getSheetByName("SECCIONES");
  const jsonFechas = JSON.stringify(form.fechas);

  sheetSecc.appendRow([
    "SEC-" + Math.floor(Math.random() * 100000),
    form.idInstitucion,
    form.nombreSeccion,
    form.anio,
    form.cantPeriodos,
    jsonFechas,
    idUsuario
  ]);
  return { success: true, message: "Sección creada" };
}

function crearInstitucion(emailUsuario, nombreInst) {
  const idUsuario = obtenerIdUsuarioPorEmail(emailUsuario);
  if(!idUsuario) return { success: false, message: "Usuario erróneo" };
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheetInst = ss.getSheetByName("INSTITUCIONES");
  sheetInst.appendRow(["INST-" + Math.floor(Math.random() * 10000), nombreInst, idUsuario]);
  return { success: true, message: "Institución creada" };
}

function obtenerListaUsuarios() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const data = ss.getSheetByName("USUARIOS").getDataRange().getValues();
  let usuarios = [];
  for (let i = 1; i < data.length; i++) {
    let estado = data[i][7] ? data[i][7] : "ACTIVO";
    usuarios.push({
      id: data[i][0],
      nombre: data[i][1],
      email: data[i][2],
      rol: data[i][4],
      tipo: data[i][5],
      vence: formatearFecha(data[i][6]),
      estado: estado
    });
  }
  return usuarios;
}

function registrarNuevoUsuario(email, tipo, nombre) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("USUARIOS");
  const data = sheet.getDataRange().getValues();

  const emailInput = String(email).trim().toLowerCase();

  for(let i=1; i<data.length; i++) {
    const rowEmail = String(data[i][2]).trim().toLowerCase();
    if (rowEmail === "") continue;
    if(rowEmail === emailInput) {
        return { success: false, message: "Error: El correo " + emailInput + " ya existe en la fila " + (i+1) };
    }
  }

  let fechaVence = new Date();

  if (tipo.includes('Demo')) {
    fechaVence.setDate(fechaVence.getDate() + 3);
  } else if (tipo.includes('Mensual')) {
    fechaVence.setMonth(fechaVence.getMonth() + 1);
  } else if (tipo.includes('Anual')) {
    fechaVence.setFullYear(fechaVence.getFullYear() + 1);
  } else if (tipo.includes('Full') || tipo.includes('Vitalicio')) {
    fechaVence.setFullYear(fechaVence.getFullYear() + 50);
  }

  const pass = Math.random().toString(36).slice(-6).toUpperCase();

  sheet.appendRow([
    "USR-" + Date.now(),
    nombre,
    email.trim(),
    pass,
    "DOCENTE",
    tipo,
    fechaVence
  ]);

  const fechaStr = Utilities.formatDate(fechaVence, Session.getScriptTimeZone(), "dd/MM/yyyy");

  return {
      success: true,
      datos: { email: email, pass: pass, vence: fechaStr }
  };
}

function obtenerEstudiantes(idSeccion) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("ESTUDIANTES");
  if(!sheet) return [];

  const data = sheet.getDataRange().getValues();
  let lista = [];

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() === String(idSeccion).trim()) {

      const valorColumnaL = String(data[i][11]).toUpperCase().trim();
      const esEximido = (valorColumnaL === "TRUE");

      lista.push({
        id: data[i][0],
        cedula: data[i][2],
        nombre: data[i][3],
        telEst: data[i][4],
        telEnc: data[i][5],
        fechaNac: formatearFechaInput(data[i][6]),
        emailEst: data[i][7],
        adecuacion: data[i][8],
        emailEnc: data[i][10],
        eximido: esEximido
      });
    }
  }
  return lista;
}

function toggleExemptStatus(idEstudiante, nuevoEstado) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("ESTUDIANTES");
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) == String(idEstudiante)) {
      sheet.getRange(i + 1, 12).setValue(nuevoEstado);
      return { success: true };
    }
  }
  return { success: false };
}

function guardarEstudiante(form) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("ESTUDIANTES");
  const emailAutomatico = form.cedula.trim() + "@est.mep.go.cr";

  const valorEximido = (form.eximido === true || form.eximido === "true");

  if (form.idEstudiante) {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) == String(form.idEstudiante)) {
        const row = i + 1;
        sheet.getRange(row, 3).setValue(form.cedula);
        sheet.getRange(row, 4).setValue(form.nombre);
        sheet.getRange(row, 5).setValue(form.telEst);
        sheet.getRange(row, 6).setValue(form.telEnc);
        sheet.getRange(row, 7).setValue(form.fechaNac);
        sheet.getRange(row, 8).setValue(emailAutomatico);
        sheet.getRange(row, 9).setValue(form.adecuacion);
        sheet.getRange(row, 11).setValue(form.emailEnc);
        sheet.getRange(row, 12).setValue(valorEximido);
        return { success: true, message: "Estudiante actualizado" };
      }
    }
  }

  sheet.appendRow([
    "EST-" + Date.now(),
    form.idSeccion,
    form.cedula,
    form.nombre,
    form.telEst,
    form.telEnc,
    form.fechaNac,
    emailAutomatico,
    form.adecuacion,
    new Date(),
    form.emailEnc,
    valorEximido
  ]);

  return { success: true, message: "Estudiante creado" };
}

function importarEstudiantesMasivo(idSeccion, datos) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("ESTUDIANTES");
  let filas = [];

  datos.forEach(f => {
    let cedula = String(f[0]).trim();
    let nombre = String(f[1]).trim();
    let telefono = f[2] ? String(f[2]).trim() : "";
    let emailAuto = cedula + "@est.mep.go.cr";

    filas.push([
      "EST-" + Math.floor(Math.random() * 1e9),
      idSeccion,
      cedula,
      nombre,
      telefono,
      "",
      "",
      emailAuto,
      "NO",
      new Date(),
      ""
    ]);
  });

  if(filas.length > 0) {
    sheet.getRange(sheet.getLastRow()+1, 1, filas.length, filas[0].length).setValues(filas);
  }

  return { success: true, message: "Se importaron " + filas.length + " estudiantes correctamente." };
}

function eliminarEstudiante(id) {
  return eliminarFilaGenerico("ESTUDIANTES", id);
}

// --- MATERIAS, INDICADORES, NOTAS ---
function obtenerMaterias(idSeccion) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const data = ss.getSheetByName("MATERIAS").getDataRange().getValues();
  let lista = [];
  for(let i=1; i<data.length; i++){
    if(String(data[i][1]) == String(idSeccion)) {
        lista.push({
            id: data[i][0],
            nombre: data[i][2],
            cotidiano: data[i][3],
            tareas: data[i][4],
            pruebas: data[i][5],
            proyectos: data[i][6],
            asistencia: data[i][7],
            notaMinima: data[i][8] || 65
        });
    }
  }
  return lista;
}

function guardarMateria(form) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("MATERIAS");

  const notaMin = form.notaMinima || 65;

  if(form.idMateria) {
    const data = sheet.getDataRange().getValues();
    for(let i=1; i<data.length; i++){
       if(String(data[i][0]) == String(form.idMateria)){
         const row = i + 1;
         sheet.getRange(row, 3).setValue(form.nombre);
         sheet.getRange(row, 4).setValue(form.cotidiano);
         sheet.getRange(row, 5).setValue(form.tareas);
         sheet.getRange(row, 6).setValue(form.pruebas);
         sheet.getRange(row, 7).setValue(form.proyectos);
         sheet.getRange(row, 8).setValue(form.asistencia);
         sheet.getRange(row, 9).setValue(notaMin);
         return {success: true, message: "Materia actualizada"};
       }
    }
  }

  sheet.appendRow([
    "MAT-"+Math.floor(Math.random()*1e6),
    form.idSeccion,
    form.nombre,
    form.cotidiano,
    form.tareas,
    form.pruebas,
    form.proyectos,
    form.asistencia,
    notaMin
  ]);
  return {success: true, message: "Materia creada"};
}

function eliminarMateria(id) { return eliminarFilaGenerico("MATERIAS", id); }

function guardarIndicador(form) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("INDICADORES");

  if(form.idIndicador){
    const data = sheet.getDataRange().getValues();
    for(let i=1; i<data.length; i++) {
      if(String(data[i][0])==String(form.idIndicador)) {
         sheet.getRange(i+1, 4).setValue(form.descripcion);
         sheet.getRange(i+1, 5).setValue(form.puntaje);
         sheet.getRange(i+1, 7).setValue(form.puntosTotales || 100);
         return {success:true};
      }
    }
  }

  sheet.appendRow([
    "IND-"+Date.now(),
    form.idMateria,
    form.categoria,
    form.descripcion,
    form.puntaje,
    new Date(),
    form.puntosTotales || 100
  ]);
  return {success:true};
}

function obtenerIndicadores(idMateria, categoria) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const data = ss.getSheetByName("INDICADORES").getDataRange().getValues();
  const dataNotas = ss.getSheetByName("NOTAS").getDataRange().getValues();
  const dataMat = ss.getSheetByName("MATERIAS").getDataRange().getValues();
  const dataEst = ss.getSheetByName("ESTUDIANTES").getDataRange().getValues();

  // Obtener sección de la materia para contar estudiantes
  let idSec = null;
  for(let i=1; i<dataMat.length; i++) {
    if(String(dataMat[i][0]) == String(idMateria)) { idSec = String(dataMat[i][1]); break; }
  }
  let totalEst = 0;
  if(idSec) {
    for(let i=1; i<dataEst.length; i++) {
      if(String(dataEst[i][1]) == idSec) totalEst++;
    }
  }

  let lista = [];
  for(let i=1; i<data.length; i++){
    if(String(data[i][1]) == String(idMateria) && (categoria === 'ALL' || String(data[i][2]) == String(categoria))) {
      let idInd = String(data[i][0]);
      let notasCount = 0;
      for(let n=1; n<dataNotas.length; n++) {
        if(String(dataNotas[n][1]) == idInd) notasCount++;
      }
      lista.push({
        id: data[i][0],
        categoria: data[i][2],
        descripcion: data[i][3],
        puntaje: data[i][4],
        puntosTotales: data[i][6] || 100,
        tieneNotas: notasCount > 0,
        notasCount: notasCount,
        totalEst: totalEst
      });
    }
  }
  return lista;
}

function eliminarIndicador(id) { return eliminarFilaGenerico("INDICADORES", id); }

// ==========================================================
// MOTOR DE EVALUACIÓN
// ==========================================================

function obtenerDatosEvaluacion(idSeccion, idIndicador) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const ests = obtenerEstudiantes(idSeccion);
  const dataNotas = ss.getSheetByName("NOTAS").getDataRange().getValues();

  const sheetInd = ss.getSheetByName("INDICADORES");
  const dataInd = sheetInd.getDataRange().getValues();
  let esCotidiano = false;
  let puntosTotalesInd = 100;

  for(let i = 1; i < dataInd.length; i++) {
    if(String(dataInd[i][0]).trim() === String(idIndicador).trim()) {
      esCotidiano = (String(dataInd[i][2]).trim() === "TRAB_COT");
      puntosTotalesInd = Number(dataInd[i][6] || 100);
      break;
    }
  }

  let map = {};
  const idIndRef = String(idIndicador).trim();

  for(let i = 1; i < dataNotas.length; i++) {
    let idIndHoja = String(dataNotas[i][1]).trim();
    let idEstHoja = String(dataNotas[i][2]).trim();

    if(idIndHoja === idIndRef) {
      map[idEstHoja] = {
        nota: dataNotas[i][3],
        fecha: dataNotas[i][4] ? formatearFecha(dataNotas[i][4]) : "",
        nivel: dataNotas[i][5]
      };
    }
  }

  return ests.map(e => {
    let estId = String(e.id).trim();
    let dataNota = map[estId];

    let nivelFinal = null;
    let notaFinal = "";

    if (dataNota) {
       if (dataNota.nivel !== "" && dataNota.nivel !== null && dataNota.nivel !== undefined) {
          nivelFinal = Number(dataNota.nivel);
          notaFinal = dataNota.nota;
       }
       else if (dataNota.nota !== "" && dataNota.nota !== null && dataNota.nota !== undefined) {
          let valorViejo = Number(dataNota.nota);

          if (esCotidiano) {
             nivelFinal = valorViejo;
             notaFinal = valorViejo;
          } else {
             nivelFinal = valorViejo;
             notaFinal = (valorViejo / puntosTotalesInd) * 100;
          }
       }
    }

    return {
      id: e.id,
      nombre: e.nombre,
      nota: notaFinal,
      fecha: dataNota ? dataNota.fecha : "",
      nivel: nivelFinal,
      puntosTotales: puntosTotalesInd
    };
  });
}

function guardarCalificaciones(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("NOTAS");
  const fechaActual = formatearFechaInput(new Date());
  const indId = String(data.idIndicador).trim();

  // Leer indicador desde Sheets para calcular % con datos autoritativos
  const dataInd = ss.getSheetByName("INDICADORES").getDataRange().getValues();
  let puntajeInd = 0, puntosTotalesInd = 100, esCotidianoInd = false;
  for (let k = 1; k < dataInd.length; k++) {
    if (String(dataInd[k][0]).trim() === indId) {
      esCotidianoInd = String(dataInd[k][2]).trim() === "TRAB_COT";
      puntajeInd     = parseFloat(dataInd[k][4]) || 0;
      puntosTotalesInd = parseFloat(dataInd[k][6]) || 100;
      break;
    }
  }

  const dataNotas = sheet.getDataRange().getValues();

  data.lista.forEach(i => {
    let fila = -1;
    let estId = String(i.idEst).trim();
    const nivelBruto = parseFloat(i.nivel);

    // Calcular % en backend para evitar dependencia del estado del frontend
    let porcObtenido;
    if (esCotidianoInd) {
      porcObtenido = parseFloat(((nivelBruto / 3) * puntajeInd).toFixed(2));
    } else {
      porcObtenido = parseFloat(((nivelBruto / puntosTotalesInd) * puntajeInd).toFixed(2));
    }

    for(let r = 1; r < dataNotas.length; r++) {
      if(String(dataNotas[r][1]).trim() === indId && String(dataNotas[r][2]).trim() === estId) {
        fila = r + 1;
        break;
      }
    }

    if(fila > -1) {
      sheet.getRange(fila, 4).setValue(porcObtenido);
      sheet.getRange(fila, 5).setValue(fechaActual);
      sheet.getRange(fila, 6).setValue(nivelBruto);
    } else {
      sheet.appendRow([
        "NOTE-" + Date.now() + Math.floor(Math.random() * 1000),
        indId,
        estId,
        porcObtenido,
        fechaActual,
        nivelBruto
      ]);

      dataNotas.push(["", indId, estId, "", "", ""]);
    }
  });
  return {success: true, message: "Notas guardadas correctamente"};
}

// ==========================================
// NUEVO MOTOR: HORARIOS Y ASISTENCIA 2.0
// ==========================================

function guardarConfigHorario(form) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName("CONF_HORARIO");

  const idUsuario = obtenerIdUsuarioPorEmail(form.email);
  const diasJson = JSON.stringify(form.diasConfig);

  if (form.idConfig) {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) == String(form.idConfig)) {
        const fila = i + 1;
        sheet.getRange(fila, 3).setValue(form.idMateria);
        sheet.getRange(fila, 4).setValue(form.fechaIni);
        sheet.getRange(fila, 5).setValue(form.fechaFin);
        sheet.getRange(fila, 6).setValue(diasJson);

        return { success: true, message: "Horario actualizado correctamente." };
      }
    }
  }

  sheet.appendRow([
    "CFG-" + Date.now(),
    form.idSeccion,
    form.idMateria,
    form.fechaIni,
    form.fechaFin,
    diasJson,
    idUsuario
  ]);

  return { success: true, message: "Bloque de horario configurado." };
}

function obtenerConfigHorarios(idSeccion) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("CONF_HORARIO");
  if(!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const sheetMat = ss.getSheetByName("MATERIAS");
  const dataMat = sheetMat ? sheetMat.getDataRange().getValues() : [];
  let mapMat = {};
  for(let i=1; i<dataMat.length; i++) mapMat[dataMat[i][0]] = dataMat[i][2];

  let lista = [];
  for(let i=1; i<data.length; i++){
    if(String(data[i][1]) == String(idSeccion)){
      lista.push({
        id: data[i][0],
        idMateria: data[i][2],
        nomMateria: mapMat[data[i][2]] || "Materia Borrada",
        ini: formatearFechaInput(data[i][3]),
        fin: formatearFechaInput(data[i][4]),
        dias: JSON.parse(data[i][5])
      });
    }
  }
  return lista;
}

function eliminarConfigHorario(id) {
  return eliminarFilaGenerico("CONF_HORARIO", id);
}

function obtenerMatrizAsistencia(idSeccion, idMateria, fechaDesde, fechaHasta) {
  const ss = SpreadsheetApp.openById(SHEET_ID);

  const sheetEst = ss.getSheetByName("ESTUDIANTES");
  const dataEst = sheetEst.getDataRange().getValues();
  let estudiantes = [];

  for(let i=1; i<dataEst.length; i++) {
    const idSecFila = String(dataEst[i][1]);
    const esEximido = dataEst[i][11] === true || dataEst[i][11] === "true";

    if(idSecFila === String(idSeccion) && !esEximido) {
      estudiantes.push({
        id: dataEst[i][0],
        nombre: dataEst[i][3],
        cedula: dataEst[i][2]
      });
    }
  }

  const sheetAsis = ss.getSheetByName("ASISTENCIA_DATA");
  if(!sheetAsis) ss.insertSheet("ASISTENCIA_DATA");

  const dataAsis = sheetAsis ? sheetAsis.getDataRange().getValues() : [];
  let marcas = {};

  const fD = new Date(fechaDesde);
  const fH = new Date(fechaHasta);

  for(let i=1; i<dataAsis.length; i++){
    let fechaRow = new Date(dataAsis[i][1]);
    let idMatRow = String(dataAsis[i][3]);

    if(idMatRow == String(idMateria) && fechaRow >= fD && fechaRow <= fH) {
       let fechaStr = formatearFechaInput(dataAsis[i][1]);
       let key = dataAsis[i][2] + "|" + fechaStr;
       marcas[key] = dataAsis[i][4];
    }
  }

  const configs = obtenerConfigHorarios(idSeccion).filter(c => c.idMateria == idMateria);

  return {
    estudiantes: estudiantes,
    marcas: marcas,
    configs: configs
  };
}

function guardarMarcaAsistencia(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName("ASISTENCIA_DATA");
    if(!sheet) {
      sheet = ss.insertSheet("ASISTENCIA_DATA");
      sheet.appendRow(["ID", "FECHA", "ID_EST", "ID_MAT", "ESTADO", "USER"]);
    }

    const idUser = obtenerIdUsuarioPorEmail(payload.email);
    const data = sheet.getDataRange().getValues();
    const fechaInput = formatearFechaInput(payload.fecha);

    let filasEncontradas = [];
    for(let i = 1; i < data.length; i++){
      if(String(data[i][2]) == String(payload.idEst) &&
         String(data[i][3]) == String(payload.idMateria) &&
         formatearFechaInput(data[i][1]) == fechaInput) {
        filasEncontradas.push(i + 1);
      }
    }

    if(filasEncontradas.length > 0) {
      sheet.getRange(filasEncontradas[0], 5).setValue(payload.estado);

      for(let k = filasEncontradas.length - 1; k >= 1; k--) {
        sheet.deleteRow(filasEncontradas[k]);
      }
    } else {
      sheet.appendRow(["AS-" + Date.now(), payload.fecha, payload.idEst, payload.idMateria, payload.estado, idUser]);
    }

    return { success: true };

 } finally {
    SpreadsheetApp.flush();
    lock.releaseLock();
  }
}

function limpiarDuplicadosAsistencia() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("ASISTENCIA_DATA");
  const data = sheet.getDataRange().getValues();

  let mapa = {};

  for(let i = 1; i < data.length; i++) {
    const fechaStr = formatearFechaInput(data[i][1]);
    const key = String(data[i][2]) + "|" + String(data[i][3]) + "|" + fechaStr;

    if(!mapa[key]) {
      mapa[key] = { fila: i + 1, estado: data[i][4] };
    } else {
      mapa[key].estado = data[i][4];
      mapa[key].duplicados = mapa[key].duplicados || [];
      mapa[key].duplicados.push(i + 1);
    }
  }

  let filasAEliminar = [];
  for(let key in mapa) {
    if(mapa[key].duplicados) {
      sheet.getRange(mapa[key].fila, 5).setValue(mapa[key].estado);
      filasAEliminar = filasAEliminar.concat(mapa[key].duplicados);
    }
  }

  filasAEliminar.sort((a, b) => b - a);
  filasAEliminar.forEach(fila => sheet.deleteRow(fila));

  return "Limpieza completa. Filas eliminadas: " + filasAEliminar.length;
}

// ==========================================
// MÓDULO BITÁCORA
// ==========================================

function guardarBitacora(form) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName("BITACORAS");
    const idUsuario = obtenerIdUsuarioPorEmail(form.email);

    if (form.idBitacora) {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) == String(form.idBitacora)) {
          const fila = i + 1;
          sheet.getRange(fila, 2).setValue(form.idSeccion);
          sheet.getRange(fila, 3).setValue(form.idMateria || "GENERAL");
          sheet.getRange(fila, 4).setValue(form.idEstudiante || "GENERAL");
          sheet.getRange(fila, 5).setValue(form.tipo);
          sheet.getRange(fila, 6).setValue(form.fecha);
          sheet.getRange(fila, 7).setValue(form.descripcion);
          sheet.getRange(fila, 10).setValue(form.fechaRecordatorio || "");
          return { success: true, message: "Bitácora actualizada." };
        }
      }
    }

    sheet.appendRow([
      "BIT-" + Date.now(),
      form.idSeccion,
      form.idMateria || "GENERAL",
      form.idEstudiante || "GENERAL",
      form.tipo,
      form.fecha,
      form.descripcion,
      "Abierto",
      idUsuario,
      form.fechaRecordatorio || ""
    ]);

    return { success: true, message: "Incidencia registrada." };
  } catch (e) { return { success: false, message: e.toString() }; }
}

function obtenerBitacoras(email) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName("BITACORAS");
    if(!sheet) return [];

    const data = sheet.getDataRange().getValues();
    const idUsuario = obtenerIdUsuarioPorEmail(email);

    const dataEst = ss.getSheetByName("ESTUDIANTES").getDataRange().getValues();
    const dataSec = ss.getSheetByName("SECCIONES").getDataRange().getValues();
    const dataMat = ss.getSheetByName("MATERIAS").getDataRange().getValues();

    let mapEst = {}; dataEst.forEach(r => mapEst[r[0]] = r[3]);
    let mapSec = {}; let mapInstPorSec = {};
    dataSec.forEach(r => { mapSec[r[0]] = r[2]; mapInstPorSec[r[0]] = r[1]; });
    let mapMat = {}; dataMat.forEach(r => mapMat[r[0]] = r[2]);

    let lista = [];
    for(let i=1; i<data.length; i++){
      if(String(data[i][8]).trim() === String(idUsuario).trim()){
          lista.push({
            id: data[i][0],
            idSeccion: data[i][1],
            idInstitucion: mapInstPorSec[data[i][1]] || "",
            idMateria: data[i][2],
            idEstudiante: data[i][3],
            nombreSeccion: mapSec[data[i][1]] || "---",
            tipo: data[i][4],
            nombreEstudiante: mapEst[data[i][3]] || "General / Grupal",
            nombreMateria: mapMat[data[i][2]] || "General",
            fecha: formatearFechaInput(data[i][5]),
            desc: data[i][6],
            estado: data[i][7],
            recordatorio: formatearFechaInput(data[i][9])
          });
      }
    }
    return lista.reverse();
  } catch(e) { return []; }
}

function cerrarBitacora(id) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("BITACORAS");
  const data = sheet.getDataRange().getValues();

  for(let i=1; i<data.length; i++){
    if(String(data[i][0]) == String(id)){
      sheet.getRange(i+1, 8).setValue("Cerrado");
      return { success: true, message: "Caso cerrado correctamente." };
    }
  }
  return { success: false, message: "Incidencia no encontrada." };
}

function contarAlertas(email) {
  const lista = obtenerBitacoras(email, null);
  const hoy = new Date();

  const pendientes = lista.filter(b => {
    if(b.estado !== 'Abierto') return false;
    if(!b.recordatorio) return false;

    let parts = b.recordatorio.split('-');
    let fAlert = new Date(parts[0], parts[1]-1, parts[2]);

    return fAlert <= hoy;
  });

  return pendientes.length;
}

function eliminarBitacora(id) {
  return eliminarFilaGenerico("BITACORAS", id);
}

// --- MI AULA ---
function guardarLeccion(form) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("MIAULA");
  const idUsuario = obtenerIdUsuarioPorEmail(form.email);
  let fileUrl = "", fileName = "";

  if (form.archivoBase64 && form.archivoNombre) {
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const blob = Utilities.newBlob(Utilities.base64Decode(form.archivoBase64), form.archivoMime, form.archivoNombre);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    fileUrl = file.getUrl(); fileName = form.archivoNombre;
  }
  sheet.appendRow(["LEC-" + Date.now(), form.idMateria, form.titulo, form.descripcion, fileUrl, form.linkExtra, new Date(), idUsuario, fileName]);
  return { success: true, message: "Lección publicada" };
}

function obtenerLeccionesDocente(email) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName("MIAULA");
    if(!sheet) return [];

    const data = sheet.getDataRange().getValues();
    const idUsuario = obtenerIdUsuarioPorEmail(email);

    const dataMat = ss.getSheetByName("MATERIAS").getDataRange().getValues();
    const dataSec = ss.getSheetByName("SECCIONES").getDataRange().getValues();
    const dataInd = ss.getSheetByName("INDICADORES").getDataRange().getValues();

    let mapMatName = {};
    let mapMatToSec = {};
    dataMat.forEach(r => { mapMatName[r[0]] = r[2]; mapMatToSec[r[0]] = r[1]; });

    let mapSecToInst = {};
    dataSec.forEach(r => mapSecToInst[r[0]] = r[1]);

    let mapInd = {};
    dataInd.forEach(r => mapInd[r[0]] = r[3] + " (" + r[2] + ")");

    let lista = [];
    for(let i=1; i<data.length; i++){
      if(String(data[i][7]) == String(idUsuario)){
         let idMat = data[i][1];
         let idSec = mapMatToSec[idMat];

         let tipo = data[i][9] ? String(data[i][9]) : "Clase";
         let idInd = data[i][10] ? String(data[i][10]) : "";

         lista.push({
           id: data[i][0],
           idMateria: idMat,
           idSeccion: idSec,
           idInstitucion: mapSecToInst[idSec],
           materia: mapMatName[idMat] || "General",
           titulo: data[i][2],
           desc: data[i][3],
           fileUrl: data[i][4],
           link: data[i][5],
           fecha: formatearFechaInput(data[i][6]),
           fileName: data[i][8],
           tipo: tipo,
           idIndicador: idInd,
           nombreIndicador: mapInd[idInd] || "Sin vincular"
         });
      }
    }
    return lista.reverse();
  } catch(e) { return []; }
}

function eliminarLeccion(id) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("MIAULA");
  const data = sheet.getDataRange().getValues();

  for(let i=1; i<data.length; i++){
    if(String(data[i][0]) == String(id)){
      sheet.deleteRow(i+1);
      return { success: true, message: "Contenido eliminado." };
    }
  }
  return { success: false, message: "No se encontró el ID." };
}

// --- TRASLADOS ---
function moverEstudianteDeSeccion(idEstudiante, idNuevaSeccion) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("ESTUDIANTES");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) == String(idEstudiante)) {
      sheet.getRange(i + 1, 2).setValue(idNuevaSeccion);
      return { success: true, message: "Traslado realizado." };
    }
  }
  return { success: false, message: "Estudiante no encontrado." };
}

// --- UTILIDADES ---
function eliminarFilaGenerico(hoja, id) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(hoja);
  const data = sheet.getDataRange().getValues();
  for(let i=1; i<data.length; i++) if(String(data[i][0]) == String(id)) { sheet.deleteRow(i+1); return {success: true}; }
  return {success: false};
}

function obtenerIdUsuarioPorEmail(email) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const data = ss.getSheetByName("USUARIOS").getDataRange().getValues();
  for(let i=1; i<data.length; i++) if(String(data[i][2]).toLowerCase() == String(email).toLowerCase()) return data[i][0];
  return null;
}

function formatearFecha(f) { try{return Utilities.formatDate(new Date(f), Session.getScriptTimeZone(), "dd/MM/yyyy")}catch(e){return f} }

function formatearFechaInput(f) {
  if (!f) return "";

  if (typeof f === 'string' && f.includes('-') && f.length >= 10) {
     return f.substring(0, 10);
  }

  try {
    return Utilities.formatDate(new Date(f), Session.getScriptTimeZone(), "yyyy-MM-dd");
  } catch(e) {
    return "";
  }
}

function generarPassword() { return Math.random().toString(36).slice(-6).toUpperCase(); }

// ==========================================
// PDF BITÁCORA
// ==========================================

function generarPdfIncidencia(idBitacora) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName("BITACORAS");
    const data = sheet.getDataRange().getValues();

    let row = null;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) == String(idBitacora)) {
        row = data[i];
        break;
      }
    }
    if (!row) throw new Error("Incidencia no encontrada");

    const idSeccion = row[1];
    const idEstudiante = row[3];
    const tipo = row[4];
    let fecha = "---";
    try { fecha = Utilities.formatDate(new Date(row[5]), Session.getScriptTimeZone(), "dd/MM/yyyy"); } catch(e){}

    const descripcion = row[6] || "Sin descripción";
    const estado = row[7];

    let nombreEstudiante = "N/A (Incidencia Grupal)";

    if (tipo === 'Estudiante' && idEstudiante && idEstudiante !== "GENERAL") {
       const sheetEst = ss.getSheetByName("ESTUDIANTES");
       const dataEst = sheetEst.getDataRange().getValues();
       for(let i=1; i<dataEst.length; i++){
         if(String(dataEst[i][0]) == String(idEstudiante)) {
             nombreEstudiante = dataEst[i][3];
             break;
         }
       }
    }

    let nombreSeccion = "General";
    const sheetSec = ss.getSheetByName("SECCIONES");
    const dataSec = sheetSec.getDataRange().getValues();
    for(let i=1; i<dataSec.length; i++){
       if(String(dataSec[i][0]) == String(idSeccion)) {
           nombreSeccion = dataSec[i][2];
           break;
       }
    }

    let html = `
      <div style="font-family: Helvetica, Arial, sans-serif; padding: 40px; color: #333;">

        <div style="text-align: center; border-bottom: 3px solid #D97706; padding-bottom: 15px; margin-bottom: 30px;">
           <h2 style="color: #D97706; margin: 0; text-transform: uppercase;">Reporte de Bitácora</h2>
           <p style="margin: 5px 0; color: #666; font-size: 12px;">Control de Incidencias - RegistraME</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 14px;">
           <tr>
             <td style="padding: 10px; background: #f9fafb; font-weight: bold; width: 30%;">Fecha del Evento:</td>
             <td style="padding: 10px; border-bottom: 1px solid #eee;">${fecha}</td>
           </tr>
           <tr>
             <td style="padding: 10px; background: #f9fafb; font-weight: bold;">Tipo:</td>
             <td style="padding: 10px; border-bottom: 1px solid #eee;">${tipo}</td>
           </tr>
           <tr>
             <td style="padding: 10px; background: #f9fafb; font-weight: bold;">Sección:</td>
             <td style="padding: 10px; border-bottom: 1px solid #eee;">${nombreSeccion}</td>
           </tr>
           <tr>
             <td style="padding: 10px; background: #f9fafb; font-weight: bold;">Involucrado:</td>
             <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">${nombreEstudiante}</td>
           </tr>
           <tr>
             <td style="padding: 10px; background: #f9fafb; font-weight: bold;">Estado Actual:</td>
             <td style="padding: 10px; border-bottom: 1px solid #eee;">${estado}</td>
           </tr>
        </table>

        <div style="margin-bottom: 40px;">
           <h4 style="background: #fffbeb; padding: 10px; border-left: 4px solid #D97706; color: #92400e; margin-bottom: 10px;">Detalle de lo sucedido</h4>
           <div style="padding: 15px; border: 1px solid #e5e7eb; border-radius: 4px; min-height: 120px; line-height: 1.6; text-align: justify; white-space: pre-wrap;">${descripcion}</div>
        </div>

        <div style="margin-top: 80px;">
           <table style="width: 100%; text-align: center; font-size: 12px;">
              <tr>
                 <td style="width: 40%; border-top: 1px solid #999; padding-top: 5px;">Firma del Docente</td>
                 <td style="width: 20%;"></td>
                 <td style="width: 40%; border-top: 1px solid #999; padding-top: 5px;">Firma Dirección / Encargado</td>
              </tr>
           </table>
        </div>

        <div style="text-align: center; margin-top: 40px; font-size: 10px; color: #aaa;">
            Documento generado automáticamente el ${Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm")}
        </div>

      </div>
    `;

    const blob = Utilities.newBlob(html, MimeType.HTML).getAs(MimeType.PDF);
    const safeName = nombreEstudiante.replace(/[^a-zA-Z0-9 ]/g, "");
    blob.setName(`Bitacora_${safeName}.pdf`);

    return { success: true, base64: Utilities.base64Encode(blob.getBytes()), nombre: blob.getName() };

  } catch (e) {
    return { success: false, message: "Error PDF: " + e.toString() };
  }
}

function generarPdfLeccion(id) { return { success: true, base64: "", nombre: "Leccion.pdf" }; }

function actualizarSeccion(form) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("SECCIONES");
  const data = sheet.getDataRange().getValues();

  const jsonFechas = JSON.stringify(form.fechas);

  for(let i=1; i<data.length; i++){
    if(String(data[i][0]) == String(form.id)) {
       const row = i + 1;
       sheet.getRange(row, 2).setValue(form.idInstitucion);
       sheet.getRange(row, 3).setValue(form.nombre);
       sheet.getRange(row, 4).setValue(form.anio);
       sheet.getRange(row, 5).setValue(form.cantPeriodos);
       sheet.getRange(row, 6).setValue(jsonFechas);

       return { success: true, message: "Sección actualizada correctamente" };
    }
  }
  return { success: false, message: "Sección no encontrada" };
}

function eliminarSeccion(id) {
  return eliminarFilaGenerico("SECCIONES", id);
}

// ==========================================
// HELPER: recalcula nota cotidiano usando nivel actual e indicador actual
// Evita el bug de suma acumulada cuando se agregan indicadores después de calificar
// ==========================================
function calcularNotaCotidiano(nivel, puntajeIndicador) {
  if (nivel === "" || nivel === null || nivel === undefined) return null;
  return (Number(nivel) / 3) * Number(puntajeIndicador);
}

// ==========================================
// ASISTENCIA POR ESTUDIANTE Y MATERIA
// ==========================================
function obtenerAsistenciaEstudiante(idEstudiante, idMateria) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheetAsis = ss.getSheetByName("ASISTENCIA_DATA");
    if(!sheetAsis) return { success: true, conteo: { P:0, AI:0, T:0, AJ:0, E:0 }, total: 0 };

    const data = sheetAsis.getDataRange().getValues();
    let conteo = { P:0, AI:0, T:0, AJ:0, E:0 };

    for(let i=1; i<data.length; i++) {
      if(String(data[i][2]).trim() === String(idEstudiante).trim() &&
         String(data[i][3]).trim() === String(idMateria).trim()) {
        let estado = String(data[i][4]).trim().toUpperCase();
        if(conteo[estado] !== undefined) conteo[estado]++;
      }
    }

    let total = conteo.P + conteo.AI + conteo.T + conteo.AJ + conteo.E;
    let porcentaje = total > 0 ? Math.round((conteo.P / total) * 100) : 100;

    return { success: true, conteo: conteo, total: total, porcentaje: porcentaje };
  } catch(e) { return { error: e.toString() }; }
}

// ==========================================
// REPORTES AVANZADOS (BOLETA Y CUADRO)
// ==========================================

function obtenerBoletaEstudiante(idEstudiante) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const dataEst = ss.getSheetByName("ESTUDIANTES").getDataRange().getValues();
  let est = null;
  for(let i=1; i<dataEst.length; i++) {
    if(String(dataEst[i][0]).trim() == String(idEstudiante).trim()) {
      est = { id: String(dataEst[i][0]).trim(), idSec: dataEst[i][1], nombre: dataEst[i][3], cedula: dataEst[i][2] }; break;
    }
  }
  if(!est) return { error: "Estudiante no encontrado" };

  const dataMat = ss.getSheetByName("MATERIAS").getDataRange().getValues();
  let materias =[];
  for(let i=1; i<dataMat.length; i++) {
    if(String(dataMat[i][1]) == String(est.idSec)) {
      materias.push({
        id: dataMat[i][0], nombre: dataMat[i][2],
        p: { cot: dataMat[i][3], tar: dataMat[i][4], pru: dataMat[i][5], pro: dataMat[i][6], asi: dataMat[i][7] }
      });
    }
  }

  const dataInd = ss.getSheetByName("INDICADORES").getDataRange().getValues();
  const dataNotas = ss.getSheetByName("NOTAS").getDataRange().getValues();
  let reporte =[];

  materias.forEach(mat => {
    let acumulado = { 'TRAB_COT':0, 'TAREAS':0, 'PRUEBAS':0, 'PROYECTOS':0, 'ASIST':0 };

    let indMateria = dataInd.filter(row => String(row[1]) == String(mat.id));
    let tieneIndAsistencia = false;
    indMateria.forEach(ind => { if(ind[2] === 'ASIST') tieneIndAsistencia = true; });

    // Puntaje dinámico para cotidiano: totalCot / cantidad de indicadores TRAB_COT
    let totalCot = Number(mat.p.cot) || 0;
    let indsCot = indMateria.filter(ind => ind[2] === 'TRAB_COT');
    let puntajeCotDinamico = indsCot.length > 0 ? totalCot / indsCot.length : 0;

    indMateria.forEach(ind => {
       let idInd = String(ind[0]);
       let cat = ind[2];

       for(let n=1; n<dataNotas.length; n++) {
         if(String(dataNotas[n][1]) == idInd && String(dataNotas[n][2]).trim() == est.id) {
            let nota;
            if(cat === 'TRAB_COT') {
              let nivel = dataNotas[n][5];
              let notaRecalc = calcularNotaCotidiano(nivel, puntajeCotDinamico);
              nota = notaRecalc !== null ? notaRecalc : parseFloat(dataNotas[n][3]) || 0;
            } else {
              let raw = parseFloat(dataNotas[n][3]);
              nota = isFinite(raw) ? raw : 0;
            }
            if(acumulado[cat] !== undefined) acumulado[cat] += nota;
            break;
         }
       }
    });

    if (!tieneIndAsistencia) {
         let valorAsistTotal = Number(mat.p.asi) || 0;
         let mapAsist = calcularAsistenciaMap(mat.id, valorAsistTotal);
         acumulado.ASIST = mapAsist[est.id] !== undefined ? mapAsist[est.id] : valorAsistTotal;
    }

    let notaFinal = acumulado.TRAB_COT + acumulado.TAREAS + acumulado.PRUEBAS + acumulado.PROYECTOS + acumulado.ASIST;

    reporte.push({
      materia: mat.nombre,
      desglose: {
          TRAB_COT: Number(acumulado.TRAB_COT.toFixed(2)),
          TAREAS: Number(acumulado.TAREAS.toFixed(2)),
          PRUEBAS: Number(acumulado.PRUEBAS.toFixed(2)),
          PROYECTOS: Number(acumulado.PROYECTOS.toFixed(2)),
          ASIST: Number(acumulado.ASIST.toFixed(1))
      },
      final: Math.round(notaFinal)
    });
  });

  return { success: true, estudiante: est, notas: reporte };
}

// 3. OBTENER CUADRO COMPLETO DE MATERIA

function obtenerCuadroMateria(idMateria) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const dataEst = ss.getSheetByName("ESTUDIANTES").getDataRange().getValues();
    const dataMat = ss.getSheetByName("MATERIAS").getDataRange().getValues();

    let materia = null;
    for(let i=1; i<dataMat.length; i++) {
      if(String(dataMat[i][0]) == String(idMateria)) {
        materia = { id: dataMat[i][0], idSec: dataMat[i][1], nombre: dataMat[i][2], cotidiano: dataMat[i][3], valorAsist: dataMat[i][7] }; break;
      }
    }
    if(!materia) return { error: "Materia no encontrada" };

    let estudiantes =[];
    for(let i=1; i<dataEst.length; i++) {
       if(String(dataEst[i][1]) == String(materia.idSec)) {
          estudiantes.push({ id: String(dataEst[i][0]).trim(), nombre: dataEst[i][3] });
       }
    }

    const dataInd = ss.getSheetByName("INDICADORES").getDataRange().getValues();
    const dataNotas = ss.getSheetByName("NOTAS").getDataRange().getValues();

    let mapIndCat = {};
    let tieneIndAsistencia = false;
    let cantCotIndicadores = 0;

    for(let i=1; i<dataInd.length; i++) {
       if(String(dataInd[i][1]) == String(idMateria)) {
           let idInd = String(dataInd[i][0]);
           mapIndCat[idInd] = dataInd[i][2];
           if(dataInd[i][2] === 'ASIST') tieneIndAsistencia = true;
           if(dataInd[i][2] === 'TRAB_COT') cantCotIndicadores++;
       }
    }

    // Puntaje dinámico cotidiano: totalCot / cantidad de indicadores TRAB_COT
    let puntajeCotDinamico = cantCotIndicadores > 0 ? (Number(materia.cotidiano) || 0) / cantCotIndicadores : 0;

    let mapAsist = {};
    let valorAsistTotal = Number(materia.valorAsist) || 0;
    if(!tieneIndAsistencia) {
        mapAsist = calcularAsistenciaMap(idMateria, valorAsistTotal);
    }

    estudiantes.forEach(e => {
       e.notas = { 'TRAB_COT':0, 'TAREAS':0, 'PRUEBAS':0, 'PROYECTOS':0, 'ASIST':0 };
       let indYaContados = {};
       for(let n=1; n<dataNotas.length; n++) {
          let idInd = String(dataNotas[n][1]);
          if(String(dataNotas[n][2]).trim() == String(e.id) && mapIndCat[idInd] && !indYaContados[idInd]) {
             let cat = mapIndCat[idInd];
             let nota;
             if(cat === 'TRAB_COT') {
               let nivel = dataNotas[n][5];
               let notaRecalc = calcularNotaCotidiano(nivel, puntajeCotDinamico);
               nota = notaRecalc !== null ? notaRecalc : parseFloat(dataNotas[n][3]) || 0;
             } else {
               let raw = parseFloat(dataNotas[n][3]);
               nota = isFinite(raw) ? raw : 0;
             }
             e.notas[cat] += nota;
             indYaContados[idInd] = true;
          }
       }

       if (!tieneIndAsistencia) {
           e.notas.ASIST = mapAsist[e.id] !== undefined ? mapAsist[e.id] : valorAsistTotal;
       }

       e.notas.TRAB_COT = Number(e.notas.TRAB_COT.toFixed(2));
       e.notas.TAREAS = Number(e.notas.TAREAS.toFixed(2));
       e.notas.PRUEBAS = Number(e.notas.PRUEBAS.toFixed(2));
       e.notas.PROYECTOS = Number(e.notas.PROYECTOS.toFixed(2));
       e.notas.ASIST = Number(e.notas.ASIST.toFixed(1));

       e.total = Math.round(e.notas.TRAB_COT + e.notas.TAREAS + e.notas.PRUEBAS + e.notas.PROYECTOS + e.notas.ASIST);
    });

    return { success: true, materia: materia.nombre, lista: estudiantes };
  } catch(e) { return { error: e.toString() }; }
}

// ==========================================
// GENERADORES DE PDF
// ==========================================

function generarPdfNotasMateria(idMateria) {
  try {
    const datos = obtenerCuadroMateria(idMateria);
    if(datos.error) return { success: false, message: datos.error };

    let filas = "";
    datos.lista.forEach((e, idx) => {
       let color = e.total >= 70 ? "green" : "red";
       filas += `
       <tr>
         <td style="border:1px solid #ddd; padding:5px; font-size:10px; text-align:center;">${idx+1}</td>
         <td style="border:1px solid #ddd; padding:5px; font-size:10px;">${e.nombre}</td>
         <td style="border:1px solid #ddd; padding:5px; font-size:10px; text-align:center;">${e.notas.TRAB_COT}</td>
         <td style="border:1px solid #ddd; padding:5px; font-size:10px; text-align:center;">${e.notas.TAREAS}</td>
         <td style="border:1px solid #ddd; padding:5px; font-size:10px; text-align:center;">${e.notas.PRUEBAS}</td>
         <td style="border:1px solid #ddd; padding:5px; font-size:10px; text-align:center;">${e.notas.PROYECTOS}</td>
         <td style="border:1px solid #ddd; padding:5px; font-size:10px; text-align:center;">${e.notas.ASIST}</td>
         <td style="border:1px solid #ddd; padding:5px; font-size:10px; text-align:center; font-weight:bold; background-color:#f0f0f0; color:${color};">${e.total}</td>
       </tr>`;
    });

    let html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
         <h3 style="text-align:center; color:#004E64; margin-bottom:5px;">CUADRO DE RENDIMIENTO</h3>
         <h4 style="text-align:center; margin-top:0; color:#555;">${datos.materia}</h4>

         <table style="width:100%; border-collapse:collapse; margin-top:20px;">
            <thead>
                <tr style="background-color:#004E64; color:white; font-size:11px;">
                   <th style="padding:5px;">#</th>
                   <th style="padding:5px; text-align:left;">ESTUDIANTE</th>
                   <th style="padding:5px;">COT</th>
                   <th style="padding:5px;">TAR</th>
                   <th style="padding:5px;">PRU</th>
                   <th style="padding:5px;">PRO</th>
                   <th style="padding:5px;">ASI</th>
                   <th style="padding:5px;">FINAL</th>
                </tr>
            </thead>
            <tbody>${filas}</tbody>
         </table>
      </div>
    `;

    const blob = Utilities.newBlob(html, MimeType.HTML).getAs(MimeType.PDF);
    blob.setName(`Cuadro_${datos.materia}.pdf`);
    return { success: true, base64: Utilities.base64Encode(blob.getBytes()), nombre: blob.getName() };

  } catch(e) {
    return { success: false, message: e.toString() };
  }
}

// ==========================================
// PLANEAMIENTO
// ==========================================

function guardarPlaneamiento(form) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName("PLANEAMIENTOS");

    const idUsuario = obtenerIdUsuarioPorEmail(form.email);
    const estrategiasJSON = JSON.stringify({ apertura: form.apertura, desarrollo: form.desarrollo, cierre: form.cierre });
    const instrumentosJSON = JSON.stringify(form.instrumentos || []);

    if (form.idPlan) {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) == String(form.idPlan)) {
          const fila = i + 1;
          sheet.getRange(fila, 2).setValue(form.idSeccion);
          sheet.getRange(fila, 3).setValue(form.idMateria);
          sheet.getRange(fila, 4).setValue(form.periodo);
          sheet.getRange(fila, 5).setValue(form.fechaIni);
          sheet.getRange(fila, 6).setValue(form.fechaFin);
          sheet.getRange(fila, 7).setValue(form.aprendizaje);
          sheet.getRange(fila, 8).setValue(estrategiasJSON);
          sheet.getRange(fila, 9).setValue(instrumentosJSON);

          return { success: true, message: "Planeamiento actualizado correctamente." };
        }
      }
    }

    sheet.appendRow([
      "PLAN-" + Date.now(),
      form.idSeccion,
      form.idMateria,
      form.periodo,
      form.fechaIni,
      form.fechaFin,
      form.aprendizaje,
      estrategiasJSON,
      instrumentosJSON,
      new Date(),
      idUsuario
    ]);

    return { success: true, message: "Planeamiento creado exitosamente." };

  } catch (e) { return { success: false, message: "Error: " + e.toString() }; }
}

function eliminarPlaneamiento(id) {
  return eliminarFilaGenerico("PLANEAMIENTOS", id);
}

function obtenerPlaneamientosDocente(email) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName("PLANEAMIENTOS");

    if(!sheet) return [];

    const idUsuario = obtenerIdUsuarioPorEmail(email);
    const data = sheet.getDataRange().getValues();

    const sheetSec = ss.getSheetByName("SECCIONES");
    const dataSec = sheetSec ? sheetSec.getDataRange().getValues() : [];

    let mapSecNombre = {};
    let mapInstPorSec = {};

    for(let i=1; i<dataSec.length; i++) {
      mapSecNombre[dataSec[i][0]] = dataSec[i][2];
      mapInstPorSec[dataSec[i][0]] = dataSec[i][1];
    }

    const sheetMat = ss.getSheetByName("MATERIAS");
    const dataMat = sheetMat ? sheetMat.getDataRange().getValues() : [];
    let mapMatNombre = {};
    for(let i=1; i<dataMat.length; i++) {
      mapMatNombre[dataMat[i][0]] = dataMat[i][2];
    }

    let lista = [];

    for(let i=1; i<data.length; i++){
      if(data[i][0] && String(data[i][10]) == String(idUsuario)){

        let estrategias = {};
        let instrumentos = [];
        try { estrategias = JSON.parse(data[i][7]); } catch(e){}
        try { instrumentos = JSON.parse(data[i][8]); } catch(e){}

        lista.push({
          id: data[i][0],
          idSeccion: data[i][1],
          idMateria: data[i][2],
          idInstitucion: mapInstPorSec[data[i][1]] || "",
          estrategias: estrategias,
          instrumentos: instrumentos,
          nombreSeccion: mapSecNombre[data[i][1]] || "Sección Eliminada",
          nombreMateria: mapMatNombre[data[i][2]] || "Materia Eliminada",
          periodo: data[i][3],
          fechaIni: formatearFechaInput(data[i][4]),
          fechaFin: formatearFechaInput(data[i][5]),
          aprendizaje: data[i][6]
        });
      }
    }

    return lista.reverse();

  } catch(e) {
    console.error("Error obteniendo planes: " + e.toString());
    return [];
  }
}

function generarPdfPlaneamiento(idPlan) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName("PLANEAMIENTOS");
    const data = sheet.getDataRange().getValues();

    let row = null;
    for(let i=1; i<data.length; i++) {
        if(String(data[i][0]) == String(idPlan)) { row = data[i]; break; }
    }
    if(!row) return { success: false, message: "Plan no encontrado" };

    const sheetSec = ss.getSheetByName("SECCIONES");
    const sheetMat = ss.getSheetByName("MATERIAS");
    const dataSec = sheetSec.getDataRange().getValues();
    const dataMat = sheetMat.getDataRange().getValues();

    let nomSec = "---";
    for(let i=1; i<dataSec.length; i++) if(String(dataSec[i][0]) == String(row[1])) nomSec = dataSec[i][2];

    let nomMat = "---";
    for(let i=1; i<dataMat.length; i++) if(String(dataMat[i][0]) == String(row[2])) nomMat = dataMat[i][2];

    let est = JSON.parse(row[7]);
    let inst = JSON.parse(row[8]);

    let html = `
      <div style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
        <h2 style="text-align:center; color:#2563EB; border-bottom: 2px solid #2563EB; padding-bottom:10px;">Planeamiento Didáctico</h2>

        <table style="width:100%; margin-bottom:20px; border-collapse: collapse;">
            <tr><td style="padding:5px;"><strong>Materia:</strong> ${nomMat}</td><td style="padding:5px;"><strong>Sección:</strong> ${nomSec}</td></tr>
            <tr><td style="padding:5px;"><strong>Periodo:</strong> ${row[3]}</td><td style="padding:5px;"><strong>Vigencia:</strong> ${formatearFechaInput(row[4])} al ${formatearFechaInput(row[5])}</td></tr>
        </table>

        <div style="margin-bottom:20px;">
            <h4 style="background:#EFF6FF; padding:10px; color:#1E40AF; margin-bottom:5px;">Aprendizaje Esperado</h4>
            <div style="border:1px solid #ddd; padding:10px;">${row[6]}</div>
        </div>

        <div style="margin-bottom:20px;">
            <h4 style="background:#EFF6FF; padding:10px; color:#1E40AF; margin-bottom:5px;">Estrategias de Mediación</h4>
            <table style="width:100%; border:1px solid #ddd; border-collapse:collapse;">
                <tr><td style="padding:10px; border-bottom:1px solid #eee;"><strong>Apertura:</strong><br>${est.apertura}</td></tr>
                <tr><td style="padding:10px; border-bottom:1px solid #eee;"><strong>Desarrollo:</strong><br>${est.desarrollo}</td></tr>
                <tr><td style="padding:10px;"><strong>Cierre:</strong><br>${est.cierre}</td></tr>
            </table>
        </div>

        <div>
            <h4 style="background:#EFF6FF; padding:10px; color:#1E40AF; margin-bottom:5px;">Instrumentos</h4>
            <div style="border:1px solid #ddd; padding:10px;">${inst.join(', ')}</div>
        </div>
      </div>
    `;

    const blob = Utilities.newBlob(html, MimeType.HTML).getAs(MimeType.PDF);
    blob.setName(`Plan_${nomMat}_${nomSec}.pdf`);
    return { success: true, base64: Utilities.base64Encode(blob.getBytes()), nombre: blob.getName() };

  } catch(e) { return { success: false, message: e.toString() }; }
}

// ==========================================
// MÓDULO INFORME SEA (MEP COSTA RICA)
// ==========================================

function obtenerDatosReporteSEA(idMateria) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const dataMat = ss.getSheetByName("MATERIAS").getDataRange().getValues();
    let idSeccion = null, nombreMateria = "", valorAsist = 0;

    for(let i=1; i<dataMat.length; i++) {
      if(String(dataMat[i][0]) == String(idMateria)) {
        idSeccion = dataMat[i][1]; nombreMateria = dataMat[i][2]; valorAsist = dataMat[i][7]; break;
      }
    }
    if(!idSeccion) return { error: "Materia no encontrada" };

    const dataEst = ss.getSheetByName("ESTUDIANTES").getDataRange().getValues();
    let estudiantes =[];
    for(let i=1; i<dataEst.length; i++) {
       if(String(dataEst[i][1]) == String(idSeccion)) {
          estudiantes.push({ id: String(dataEst[i][0]).trim(), cedula: dataEst[i][2], nombre: dataEst[i][3] });
       }
    }

    const dataInd = ss.getSheetByName("INDICADORES").getDataRange().getValues();
    const dataNotas = ss.getSheetByName("NOTAS").getDataRange().getValues();

    let mapIndCat = {};
    let mapIndPuntaje = {}; // FIX: puntaje vigente por indicador
    let tieneIndAsistencia = false;

    for(let i=1; i<dataInd.length; i++) {
       if(String(dataInd[i][1]) == String(idMateria)) {
         let idInd = String(dataInd[i][0]);
         mapIndCat[idInd] = dataInd[i][2];
         mapIndPuntaje[idInd] = Number(dataInd[i][4]) || 0;
         if(dataInd[i][2] === 'ASIST') tieneIndAsistencia = true;
       }
    }

    let mapAsist = {};
    let valAsistTotal = Number(valorAsist) || 0;
    if(!tieneIndAsistencia) mapAsist = calcularAsistenciaMap(idMateria, valAsistTotal);

    let reporte =[];
    estudiantes.forEach(est => {
       let notas = { 'TRAB_COT':0, 'TAREAS':0, 'PRUEBAS':0, 'PROYECTOS':0, 'ASIST':0 };

       for(let n=1; n<dataNotas.length; n++) {
          let idInd = String(dataNotas[n][1]);
          let idEstNota = String(dataNotas[n][2]).trim();
          if(idEstNota == est.id && mapIndCat[idInd]) {
            let cat = mapIndCat[idInd];
            let nota;
            if(cat === 'TRAB_COT') {
              // FIX: recalcular con nivel actual y puntaje vigente del indicador
              let nivel = dataNotas[n][5];
              let notaRecalc = calcularNotaCotidiano(nivel, mapIndPuntaje[idInd]);
              nota = notaRecalc !== null ? notaRecalc : Number(dataNotas[n][3]);
            } else {
              nota = Number(dataNotas[n][3]);
            }
            notas[cat] += nota;
          }
       }

       if (!tieneIndAsistencia) {
           notas.ASIST = mapAsist[est.id] !== undefined ? mapAsist[est.id] : valAsistTotal;
       }

       reporte.push({
         Id: est.cedula,
         Nombre: est.nombre,
         Cotidiano: parseFloat(notas.TRAB_COT.toFixed(2)),
         Tareas: parseFloat((notas.TAREAS + notas.PROYECTOS).toFixed(2)),
         Prueba: parseFloat(notas.PRUEBAS.toFixed(2)),
         Asistencia: parseFloat(notas.ASIST.toFixed(1))
       });
    });

    return { success: true, lista: reporte, materia: nombreMateria };
  } catch (e) { return { error: e.toString() }; }
}

// ==========================================
// MÓDULO CORREOS
// ==========================================

function enviarReporteHogarMasivo(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheetEst = ss.getSheetByName("ESTUDIANTES");

  if (!sheetEst) return { success: false, message: "Error crítico: No existe la hoja ESTUDIANTES." };

  const dataEst = sheetEst.getDataRange().getValues();
  let enviados = 0, fallidos = 0, erroresDetallados =[];

  const nombreProfe = data.nombreDocente || "Docente a cargo";
  const emailProfe = data.emailDocente || Session.getActiveUser().getEmail();
  const nombreRemitente = nombreProfe + " - RegistraME";

  for (let idEst of data.ids) {
    let nombreEst = "Desconocido";

    try {
      let emailEncargado = "";
      let encontrado = false;

      for(let i=1; i<dataEst.length; i++) {
        if(String(dataEst[i][0]).trim() == String(idEst).trim()) {
           nombreEst = dataEst[i][3];
           emailEncargado = dataEst[i][10];
           encontrado = true;
           break;
        }
      }

      if (!encontrado) throw new Error(`No se encontró el ID ${idEst}.`);
      if (!emailEncargado || !String(emailEncargado).includes("@")) throw new Error(`Correo inválido o vacío.`);

      const pdfBlob = crearBlobPdfEstudiante(idEst, nombreProfe);

      GmailApp.sendEmail(
        emailEncargado,
        "Informe de Avance al Hogar - " + nombreEst,
        `Estimada familia:\n\n${data.mensaje}\n\nAtentamente,\n${nombreProfe}\n\n(Adjunto encontrará la radiografía académica de este periodo)`,
        {
          attachments: [pdfBlob],
          name: nombreRemitente,
          replyTo: emailProfe
        }
      );

      enviados++;

    } catch (e) {
      fallidos++;
      erroresDetallados.push(`• ${nombreEst}: ${e.message}`);
    }
  }

  let mensajeFinal = `Proceso finalizado. ✅ Enviados: ${enviados}`;
  if (fallidos > 0) {
    mensajeFinal += ` ❌ Fallidos: ${fallidos}\nDETALLE DE ERRORES:\n${erroresDetallados.join("\n")}`;
  }

  return { success: true, message: mensajeFinal, enviados: enviados, fallidos: fallidos };
}

// ==========================================
// GENERADORES DE PDF "RADIOGRAFÍA"
// ==========================================

function generarHtmlRadiografia(idEst, nombreDocente = "Docente a cargo") {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const datos = obtenerBoletaEstudiante(idEst);
  if(datos.error) throw new Error("No hay datos para generar el reporte");

  const idSec = datos.estudiante.idSec;

  const sheetEst = ss.getSheetByName("ESTUDIANTES");
  const dataEst = sheetEst.getDataRange().getValues();
  let emailEnc = "No registrado", telEnc = "No registrado";
  for(let i=1; i<dataEst.length; i++) {
    if(String(dataEst[i][0]).trim() == String(idEst).trim()) {
      telEnc = dataEst[i][5] || "No registrado";
      emailEnc = dataEst[i][10] || "No registrado";
      break;
    }
  }

  const sheetBit = ss.getSheetByName("BITACORAS");
  let htmlBitacoras = "";
  if(sheetBit) {
    const dataBit = sheetBit.getDataRange().getValues();
    let countBit = 0;
    for(let i=1; i<dataBit.length; i++) {
      let estBit = String(dataBit[i][3]).trim();
      let secBit = String(dataBit[i][1]).trim();
      if(estBit === String(idEst).trim() || (estBit === "GENERAL" && secBit === String(idSec).trim())) {
        let fechaBit = formatearFecha(dataBit[i][5]);
        let descBit = dataBit[i][6];
        htmlBitacoras += `<li style="margin-bottom:6px; color:#475569;"><b>${fechaBit}:</b> ${descBit}</li>`;
        countBit++;
      }
    }
    if(countBit === 0) htmlBitacoras = "<li style='color:#94a3b8; list-style:none;'>No presenta incidencias en este periodo. ✅</li>";
  }

  const sheetAsis = ss.getSheetByName("ASISTENCIA_DATA");
  let ausencias = [], tardias =[];
  if(sheetAsis) {
    const dataAsis = sheetAsis.getDataRange().getValues();
    for(let i=1; i<dataAsis.length; i++) {
      if(String(dataAsis[i][2]).trim() == String(idEst).trim()) {
         let estado = dataAsis[i][4];
         let fechaAsis = formatearFecha(dataAsis[i][1]);
         if(estado === 'AI') ausencias.push(fechaAsis);
         if(estado === 'T') tardias.push(fechaAsis);
      }
    }
  }

  let strAusencias = ausencias.length > 0 ? ausencias.join(', ') : 'Ninguna';
  let strTardias = tardias.length > 0 ? tardias.join(', ') : 'Ninguna';

  let filasNotas = "";
  datos.notas.forEach(n => {
     let colorHex = n.final >= 65 ? "#10b981" : "#ef4444";
     filasNotas += `
     <tr>
        <td style="border-bottom:1px solid #e2e8f0; padding:8px; font-size:12px; font-weight:bold; color:#334155;">${n.materia}</td>
        <td style="border-bottom:1px solid #e2e8f0; padding:8px; text-align:center; font-size:12px;">${n.desglose.TRAB_COT}</td>
        <td style="border-bottom:1px solid #e2e8f0; padding:8px; text-align:center; font-size:12px;">${n.desglose.TAREAS}</td>
        <td style="border-bottom:1px solid #e2e8f0; padding:8px; text-align:center; font-size:12px;">${n.desglose.PRUEBAS}</td>
        <td style="border-bottom:1px solid #e2e8f0; padding:8px; text-align:center; font-size:12px;">${n.desglose.PROYECTOS}</td>
        <td style="border-bottom:1px solid #e2e8f0; padding:8px; text-align:center; font-size:12px;">${n.desglose.ASIST}</td>
        <td style="border-bottom:1px solid #e2e8f0; padding:8px; width:120px;">
            <div style="background-color:#f1f5f9; width:100%; border-radius:4px; height:10px; overflow:hidden;">
                <div style="background-color:${colorHex}; width:${n.final}%; height:10px;"></div>
            </div>
        </td>
        <td style="border-bottom:1px solid #e2e8f0; padding:8px; text-align:right; font-weight:bold; color:${colorHex}; font-size:14px;">${n.final}</td>
     </tr>`;
  });

  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #1e293b;">
      <div style="text-align:center; border-bottom: 3px solid #4F46E5; padding-bottom:15px; margin-bottom:25px;">
         <h1 style="color:#4F46E5; margin:0; text-transform:uppercase; font-size:22px; letter-spacing:1px;">Informe de Avance al Hogar</h1>
         <p style="color:#64748b; font-size:11px; margin:5px 0 0 0;">Generado de forma automatizada por RegistraME V-Pro</p>
      </div>
      <table style="width:100%; margin-bottom:25px; border-collapse:collapse;">
        <tr>
          <td style="width:50%; padding:15px; background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
            <h4 style="margin:0 0 10px 0; color:#475569; font-size:13px; text-transform:uppercase;">Datos del Estudiante</h4>
            <p style="margin:4px 0; font-size:12px;"><b>Nombre:</b> ${datos.estudiante.nombre}</p>
            <p style="margin:4px 0; font-size:12px;"><b>Cédula:</b> ${datos.estudiante.cedula}</p>
          </td>
          <td style="width:2%;"></td>
          <td style="width:48%; padding:15px; background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
            <h4 style="margin:0 0 10px 0; color:#475569; font-size:13px; text-transform:uppercase;">Contacto de Encargado</h4>
            <p style="margin:4px 0; font-size:12px;"><b>Teléfono:</b> ${telEnc}</p>
            <p style="margin:4px 0; font-size:12px;"><b>Correo:</b> ${emailEnc}</p>
          </td>
        </tr>
      </table>
      <h3 style="color:#334155; font-size:14px; border-bottom:2px solid #e2e8f0; padding-bottom:5px; margin-bottom:10px;">📊 Rendimiento Académico</h3>
      <table style="width:100%; border-collapse:collapse; margin-bottom:30px;">
        <thead>
            <tr style="background-color:#f1f5f9; color:#475569; font-size:11px;">
               <th style="padding:8px; text-align:left;">Materia</th>
               <th style="padding:8px;">Cot</th>
               <th style="padding:8px;">Tar</th>
               <th style="padding:8px;">Pru</th>
               <th style="padding:8px;">Pro</th>
               <th style="padding:8px;">Asi</th>
               <th style="padding:8px; text-align:left;">Progreso</th>
               <th style="padding:8px; text-align:right;">NOTA</th>
            </tr>
        </thead>
        <tbody>${filasNotas}</tbody>
      </table>
      <table style="width:100%; border-collapse:collapse;">
        <tr>
            <td style="width:48%; vertical-align:top; padding-right:15px;">
                <h3 style="color:#334155; font-size:14px; border-bottom:2px solid #e2e8f0; padding-bottom:5px; margin-bottom:10px;">📅 Registro de Ausencias</h3>
                <div style="background:#fff1f2; border-left:4px solid #f43f5e; padding:10px; margin-bottom:10px; font-size:11px;">
                    <b style="color:#e11d48;">Ausencias Injustificadas:</b><br>
                    <span style="color:#475569;">${strAusencias}</span>
                </div>
                <div style="background:#fefce8; border-left:4px solid #facc15; padding:10px; font-size:11px;">
                    <b style="color:#ca8a04;">Llegadas Tardías:</b><br>
                    <span style="color:#475569;">${strTardias}</span>
                </div>
            </td>
            <td style="width:52%; vertical-align:top;">
                <h3 style="color:#334155; font-size:14px; border-bottom:2px solid #e2e8f0; padding-bottom:5px; margin-bottom:10px;">📝 Bitácora de Incidencias</h3>
                <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:10px 15px; border-radius:6px;">
                    <ul style="font-size:11px; padding-left:15px; margin:0;">
                        ${htmlBitacoras}
                    </ul>
                </div>
            </td>
        </tr>
      </table>
      <div style="margin-top:60px; text-align:center; font-size:12px; color:#475569;">
         <p>_________________________________________</p>
         <p style="margin:5px 0;"><b>Prof. ${nombreDocente}</b></p>
         <p style="margin:0; font-size:10px; color:#94a3b8;">Documento oficial para seguimiento en el hogar</p>
      </div>
    </div>
  `;
}

function crearBlobPdfEstudiante(idEst, nombreDocente) {
  let html = generarHtmlRadiografia(idEst, nombreDocente);
  return Utilities.newBlob(html, MimeType.HTML).getAs(MimeType.PDF).setName(`Informe_${idEst}.pdf`);
}

function generarPdfBoletaEstudiante(idEst) {
  let html = generarHtmlRadiografia(idEst, "Docente a cargo");
  const blob = Utilities.newBlob(html, MimeType.HTML).getAs(MimeType.PDF);
  blob.setName(`Radiografia_${idEst}.pdf`);
  return { success: true, base64: Utilities.base64Encode(blob.getBytes()), nombre: blob.getName() };
}

function generarPdfMasivoBoletas(data) {
  let htmlFinal = "";
  for(let i=0; i<data.ids.length; i++) {
      htmlFinal += generarHtmlRadiografia(data.ids[i], data.nombreDocente);
      if(i < data.ids.length - 1) htmlFinal += "<div style='page-break-after: always;'></div>";
  }
  const blob = Utilities.newBlob(htmlFinal, MimeType.HTML).getAs(MimeType.PDF);
  blob.setName("Reportes_Para_Imprimir.pdf");
  return { success: true, base64: Utilities.base64Encode(blob.getBytes()), nombre: blob.getName() };
}

function apiLogin(data) {
  const res = validarLogin(data.email, data.password);

  if (res.valid) {
    return response({ status: "success", role: res.rol === 'ADMIN' ? "ADMIN" : "DOCENTE", email: data.email });
  } else {
    if (res.reason === "LOCKED") {
      return response({status: "error", msg: "Comuníquese con soporte para validar el usuario."});
    }
    return response({status: "error", msg: "Credenciales Incorrectas"});
  }
}

function cambiarEstadoUsuario(idUsuario, nuevoEstado) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("USUARIOS");
  const data = sheet.getDataRange().getValues();

  for(let i=1; i<data.length; i++) {
    if(String(data[i][0]) == String(idUsuario)) {
       sheet.getRange(i+1, 8).setValue(nuevoEstado);
       return { success: true, message: "Usuario ahora está " + nuevoEstado };
    }
  }
  return { success: false, message: "Usuario no encontrado" };
}

// ==========================================
// CEREBRO: CALCULADORA REAL DE ASISTENCIA
// ==========================================
function calcularAsistenciaMap(idMateria, valorTotalAsist) {
   const ss = SpreadsheetApp.openById(SHEET_ID);
   let sheetCfg = ss.getSheetByName("CONF_HORARIO");
   let sheetAsis = ss.getSheetByName("ASISTENCIA_DATA");

   let mapNotas = {};
   if(!sheetCfg || !sheetAsis) return mapNotas;

   let totalLec = 0;
   let diasMap =['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
   let dataCfg = sheetCfg.getDataRange().getValues();
   let configs =[];

   for(let i=1; i<dataCfg.length; i++) {
     if(String(dataCfg[i][2]).trim() === String(idMateria).trim()) {
        let ini = new Date(dataCfg[i][3]);
        let fin = new Date(dataCfg[i][4]);
        let dias = JSON.parse(dataCfg[i][5]);
        configs.push({ini, fin, dias});

        let cur = new Date(ini.getTime());
        while(cur <= fin) {
           let dName = diasMap[cur.getDay()];
           if(dias[dName]) totalLec += Number(dias[dName]);
           cur.setDate(cur.getDate()+1);
        }
     }
   }

   if(totalLec === 0) return mapNotas;
   let factor = valorTotalAsist / totalLec;

   let dataAsis = sheetAsis.getDataRange().getValues();
   let perdidas = {};

   for(let i=1; i<dataAsis.length; i++) {
     if(String(dataAsis[i][3]).trim() === String(idMateria).trim() && dataAsis[i][4] === 'AI') {
        let idEst = String(dataAsis[i][2]).trim();
        let fecha = new Date(dataAsis[i][1]);
        let dName = diasMap[fecha.getDay()];

        let ptsPerdidos = 0;
        configs.forEach(cfg => {
           if(fecha >= cfg.ini && fecha <= cfg.fin && cfg.dias[dName]) {
              ptsPerdidos = Number(cfg.dias[dName]);
           }
        });

        if(!perdidas[idEst]) perdidas[idEst] = 0;
        perdidas[idEst] += ptsPerdidos;
     }
   }

   for(let idEst in perdidas) {
      let porcentaje = valorTotalAsist - (perdidas[idEst] * factor);
      if(porcentaje < 0) porcentaje = 0;
      mapNotas[idEst] = porcentaje;
   }

   return mapNotas;
}

function darPermisosDeCorreo() {
  const miCorreo = Session.getActiveUser().getEmail();

  GmailApp.sendEmail(
    miCorreo,
    "✅ Permisos V-Pro Activados",
    "¡Felicidades, socio! Si estás leyendo esto, significa que RegistraME ya tiene permisos totales para enviar reportes a los padres."
  );
}

function obtenerReporteAuditoriaNotas(idIndicador) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("NOTAS");
  const data = sheet.getDataRange().getValues();

  let reporte = [];
  for(let i=1; i<data.length; i++) {
    if(String(data[i][1]).trim() === String(idIndicador).trim()) {
      reporte.push({
        idNota: data[i][0],
        idEst: data[i][2],
        nota: data[i][3]
      });
    }
  }
  return reporte;
}

function generarPdfListaEstudiantes(idSeccion) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const ests = obtenerEstudiantes(idSeccion);

  let nombreSeccion = "---", nombreInstitucion = "---", nombreDocente = "---";
  const dataSec = ss.getSheetByName("SECCIONES").getDataRange().getValues();
  for (let i = 1; i < dataSec.length; i++) {
    if (String(dataSec[i][0]) === String(idSeccion)) {
      nombreSeccion = dataSec[i][2];
      const idInst = dataSec[i][1];
      const idUser = dataSec[i][6];
      const dataInst = ss.getSheetByName("INSTITUCIONES").getDataRange().getValues();
      for (let j = 1; j < dataInst.length; j++) {
        if (String(dataInst[j][0]) === String(idInst)) { nombreInstitucion = dataInst[j][1]; break; }
      }
      const dataUsers = ss.getSheetByName("USUARIOS").getDataRange().getValues();
      for (let j = 1; j < dataUsers.length; j++) {
        if (String(dataUsers[j][0]) === String(idUser)) { nombreDocente = dataUsers[j][1]; break; }
      }
      break;
    }
  }

  const fechaHora = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");

  let filas = "";
  ests.forEach(e => {
    let condicionText = e.eximido === true
      ? '<span style="color:#e11d48;font-weight:bold;background:#fff1f2;padding:2px 8px;border-radius:4px;border:1px solid #fda4af;font-size:9px;">NO RECIBE</span>'
      : '<span style="color:#16a34a;font-weight:bold;font-size:10px;">RECIBE</span>';

    filas += `
    <tr>
      <td style="border-bottom:1px solid #eee;padding:10px;font-family:monospace;">${e.cedula}</td>
      <td style="border-bottom:1px solid #eee;padding:10px;"><b>${e.nombre}</b></td>
      <td style="border-bottom:1px solid #eee;padding:10px;text-align:center;">${condicionText}</td>
      <td style="border-bottom:1px solid #eee;padding:10px;font-size:10px;">Cel: ${e.telEst || '--'}<br>Enc: ${e.telEnc || '--'}</td>
      <td style="border-bottom:1px solid #eee;padding:10px;font-size:10px;">${e.emailEst}<br>${e.emailEnc || '--'}</td>
    </tr>`;
  });

  let html = `
    <div style="font-family:Arial,sans-serif;padding:30px;box-sizing:border-box;">
      <div style="text-align:center;border-bottom:3px solid #4F46E5;padding-bottom:12px;margin-bottom:24px;">
        <h2 style="color:#4F46E5;margin:0 0 4px 0;text-transform:uppercase;font-size:18px;">Lista de Estudiantes &mdash; ${nombreSeccion}</h2>
        <p style="font-size:11px;color:#666;margin:0;">${nombreInstitucion} &nbsp;·&nbsp; RegistraME V3</p>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:30px;">
        <thead>
          <tr style="background:#f8fafc;color:#64748b;text-align:left;">
            <th style="padding:10px;border-bottom:2px solid #e2e8f0;">Cédula</th>
            <th style="padding:10px;border-bottom:2px solid #e2e8f0;">Estudiante</th>
            <th style="padding:10px;border-bottom:2px solid #e2e8f0;text-align:center;">Condición</th>
            <th style="padding:10px;border-bottom:2px solid #e2e8f0;">Contacto</th>
            <th style="padding:10px;border-bottom:2px solid #e2e8f0;">Correos</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
      <div style="border-top:1px solid #e2e8f0;padding-top:8px;font-size:9px;color:#94a3b8;text-align:center;">
        Docente: <b style="color:#475569;">${nombreDocente}</b>
        &nbsp;·&nbsp; Sección: <b style="color:#475569;">${nombreSeccion}</b>
        &nbsp;·&nbsp; Generado el: <b style="color:#475569;">${fechaHora}</b>
        &nbsp;·&nbsp; RegistraME V3
      </div>
    </div>`;

  const blob = Utilities.newBlob(html, MimeType.HTML).getAs(MimeType.PDF);
  blob.setName(`Lista_${nombreSeccion}.pdf`);
  return { success: true, base64: Utilities.base64Encode(blob.getBytes()), nombre: blob.getName() };
}
