// ==========================================
// CONFIGURACIÓN GLOBAL
// ==========================================
const SHEET_ID = "16_qGdphmdL9lLkdnl6_ByN5wmcuZ3uI4xTa1dk0m5QQ"; // <-- reemplazar antes de usar (ver sandbox/README.md)
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
    if(action === "getIndicators") return response(obtenerIndicadores(data.idMateria, data.categoria, data.periodo));
    if(action === "saveIndicator") return response(guardarIndicador(data));
    if(action === "clonarIndicadores") return response(clonarIndicadores(data.idMateria, data.periodoOrigen, data.periodoDestino, data.idsIndicadores));
    if(action === "recalcularPesoCotidiano") return response(recalcularPesoCotidiano(data.idMateria, data.periodo));
    if(action === "deleteIndicator") return response(eliminarIndicador(data.id));
    if(action === "getEvaluationData") return response(obtenerDatosEvaluacion(data.idSeccion, data.idIndicador));
    if(action === "saveGrades") return response(guardarCalificaciones(data));
    if(action === "pdfStudentReport") return response(generarPdfBoletaEstudiante(data.id));
    if(action === "pdfGrades") return response(generarPdfNotasMateria(data.id));

    // --- HORARIOS ---
    if(action === "saveConfigHorario") return response(guardarConfigHorario(data));
    if(action === "getConfigHorarios") return response(obtenerConfigHorarios(data.idSeccion));
    if(action === "getAllConfigHorarios") return response(obtenerTodosLosHorarios(data.email));
    if(action === "delConfigHorario") return response(eliminarConfigHorario(data.id));
    if(action === "getMatrixAttendance") return response(obtenerMatrizAsistencia(data.idSeccion, data.idMateria, data.fIni, data.fFin));
    if(action === "saveMark") return response(guardarMarcaAsistencia(data));
    if(action === "saveMarkBatch") return response(guardarMarcaAsistenciaBatch(data));
    if(action === "getPendingAttendanceAlerts") return response(obtenerAlertasAsistenciaPendiente(data.email, data.hoy));
    if(action === "saveNonSchoolDay") return response(guardarDiaNoLectivo(data));
    if(action === "deleteNonSchoolDay") return response(eliminarDiaNoLectivo(data.idMateria, data.fecha));
    if(action === "getNonSchoolDays") return response(obtenerDiasNoLectivos(data.idMateria));

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
    if(action === "getPendingIncidentAlerts") return response(obtenerIncidenciasPendientes(data.email));
    if(action === "pdfBitacora") return response(generarPdfIncidencia(data.id));

    // --- MI AULA ---
    if(action === "saveLesson") return response(guardarLeccion(data));
    if(action === "getLessons") return response(obtenerLeccionesDocente(data.email));
    if(action === "pdfLesson") return response(generarPdfLeccion(data.id));
    if(action === "deleteLesson") return response(eliminarLeccion(data.id));
    if(action === "shareLesson") return response(compartirLeccionPorCorreo(data));

    // --- NUEVOS REPORTES ---
    if(action === "getStudentReport") return response(obtenerBoletaEstudiante(data.id, data.periodo));
    if(action === "pdfStudentReport") return response(generarPdfBoletaEstudiante(data.id));
    if(action === "getSubjectReport") return response(obtenerCuadroMateria(data.id, data.periodo));
    if(action === "getNotaFinalAnual") return response(obtenerNotaFinalAnual(data.id));
    if(action === "obtenerReporteAuditoriaNotas") return response(obtenerReporteAuditoriaNotas(data.idIndicador));

    // --- ASISTENCIA ESTUDIANTE ---
    if(action === "getStudentAttendance") return response(obtenerAsistenciaEstudiante(data.idEstudiante, data.idMateria));

    // --- NUEVAS ACCIONES ---
    if(action === "toggleExempt") return response(toggleExemptStatus(data.id, data.status));
    if(action === "pdfStudentList") return response(generarPdfListaEstudiantes(data.id));

     // --- REPORTES SEA ---
    if(action === "getSEAReport") return response(obtenerDatosReporteSEA(data.id, data.periodo));
    if(action === "getSEAExcel") return response(generarExcelReporteSEA(data.id, data.periodo));

// --- INFORME AL HOGAR ---
    if(action === "bulkDownloadReport") return response(generarPdfMasivoBoletas(data));
    if(action === "sendBulkReport") return response(enviarReporteHogarMasivo(data));

    // --- KPIs POR SECCIÓN ---
    if(action === "getSectionKPIs") return response(getSectionKPIs(data.idSeccion));
    if(action === "getMateriaKPIs") return response(getMateriaKPIs(data.id));

    // --- AMPLIACIÓN (EXAMEN EXTRAORDINARIO) ---
    if(action === "saveAmpliacion") return response(guardarAmpliacion(data));
    if(action === "pdfAmpliaciones") return response(generarPdfAmpliaciones(data.id, data.soloConAmpliacion));

    // --- ALERTAS TEMPRANAS ---
    if(action === "getAlertasTempranas") return response(obtenerAlertasTempranas(data.idSeccion));
    if(action === "pdfAlertasTempranas") return response(generarPdfAlertasTempranas(data.idSeccion, data.filtroEstado));

    // --- SEGUIMIENTO DE ALERTAS TEMPRANAS (Fase 2) ---
    if(action === "saveAlertaTemprana") return response(guardarAlertaTemprana(data));
    if(action === "getAlertasSeguimiento") return response(obtenerAlertasSeguimiento(data.idSeccion));
    if(action === "deleteAlertaTemprana") return response(eliminarAlertaTemprana(data.idAlerta));
    if(action === "saveSeguimientoAlerta") return response(guardarSeguimientoAlerta(data));
    if(action === "getSeguimientoAlerta") return response(obtenerSeguimientoAlerta(data.idAlerta));
    if(action === "pdfSeguimientoAlerta") return response(generarPdfSeguimientoAlerta(data.idAlerta, data.email));

    // --- EXIMICIÓN (Articulo 49) ---
    if(action === "getElegiblesEximicion") return response(obtenerElegiblesEximicion(data.idMateria));
    if(action === "saveEximicion") return response(aplicarEximicion(data));
    if(action === "getHistorialEximiciones") return response(obtenerHistorialEximiciones(data.idMateria));

    // --- BITACORA DE CAMBIOS (Notas + Asistencia) ---
    if(action === "getBitacoraCambios") return response(obtenerBitacoraCambios(data.idMateria));
    if(action === "pdfBitacoraCambios") return response(generarPdfBitacoraCambios(data.id));

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

// ==========================================
// MOTOR V2: PERIODO
// Determina el periodo vigente (1, 2...) de una materia segun las fechas
// guardadas en SECCIONES.JSON_FECHAS: [{"p":1,"inicio":"YYYY-MM-DD","fin":"YYYY-MM-DD"}, ...]
// Se usa para etiquetar cada indicador con su periodo al momento de crearlo.
// Si la fecha de hoy cae fuera de todos los rangos (ej. vacaciones entre periodos),
// se usa el ultimo periodo cuyo inicio ya paso.
// ==========================================
function determinarPeriodoVigente(ss, idMateria) {
  const dataMat = ss.getSheetByName("MATERIAS").getDataRange().getValues();
  let idSec = null;
  for (let i = 1; i < dataMat.length; i++) {
    if (String(dataMat[i][0]).trim() === String(idMateria).trim()) { idSec = String(dataMat[i][1]).trim(); break; }
  }
  if (!idSec) return 1;

  const dataSec = ss.getSheetByName("SECCIONES").getDataRange().getValues();
  let fechasJSON = null;
  for (let i = 1; i < dataSec.length; i++) {
    if (String(dataSec[i][0]).trim() === idSec) { fechasJSON = dataSec[i][5]; break; }
  }
  if (!fechasJSON) return 1;

  let periodos;
  try { periodos = JSON.parse(fechasJSON); } catch (e) { return 1; }
  if (!Array.isArray(periodos) || periodos.length === 0) return 1;

  const hoy = new Date();
  for (let i = 0; i < periodos.length; i++) {
    const ini = new Date(periodos[i].inicio);
    const fin = new Date(periodos[i].fin);
    if (hoy >= ini && hoy <= fin) return periodos[i].p;
  }
  let vigente = periodos[0].p;
  periodos.forEach(per => { if (hoy >= new Date(per.inicio)) vigente = per.p; });
  return vigente;
}

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

  // Si el profe tiene un periodo especifico elegido en el selector "Ver periodo"
  // del frontend, se respeta eso (permite preparar indicadores del periodo
  // siguiente durante vacaciones, antes de que llegue su fecha de inicio).
  // Si no hay filtro activo (esta en "Todos"), se infiere por fecha como antes.
  const periodo = (form.periodo !== undefined && form.periodo !== null && form.periodo !== '')
    ? form.periodo
    : determinarPeriodoVigente(ss, form.idMateria);

  sheet.appendRow([
    "IND-"+Date.now(),
    form.idMateria,
    form.categoria,
    form.descripcion,
    form.puntaje,
    new Date(),
    form.puntosTotales || 100,
    periodo
  ]);

  // Si el indicador nuevo es de Cotidiano, el peso de TODOS los indicadores de
  // Cotidiano de este periodo cambio (se reparte entre uno mas). Antes esto
  // requeria que el profe presionara "Recalcular Pesos" a mano -- ahora se
  // recongela solo, en el momento, para que nunca quede una nota vieja con el
  // peso desactualizado. Es seguro e idempotente (ver recalcularPesoCotidiano);
  // si por algo fallara, no debe tumbar la creacion del indicador que ya se guardo.
  if (form.categoria === 'TRAB_COT') {
    try { recalcularPesoCotidiano(form.idMateria, periodo); } catch (e) {}
  }

  return {success:true};
}

function obtenerIndicadores(idMateria, categoria, periodo) {
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
    // periodo: si no se pide un periodo especifico, no se filtra (compatibilidad con
    // indicadores viejos que no tienen este campo, creados antes de este cambio).
    const periodoFila = data[i][7] || null;
    const coincideConPeriodo = periodo === undefined || periodo === null || periodo === '' || String(periodoFila) === String(periodo);
    if(String(data[i][1]) == String(idMateria) && (categoria === 'ALL' || String(data[i][2]) == String(categoria)) && coincideConPeriodo) {
      let idInd = String(data[i][0]).trim();
      let notasCount = 0;
      for(let n=1; n<dataNotas.length; n++) {
        if(String(dataNotas[n][1]).trim() == idInd) notasCount++;
      }
      lista.push({
        id: data[i][0],
        categoria: data[i][2],
        descripcion: data[i][3],
        puntaje: data[i][4],
        puntosTotales: data[i][6] || 100,
        periodo: periodoFila,
        tieneNotas: notasCount > 0,
        notasCount: notasCount,
        totalEst: totalEst
      });
    }
  }
  return lista;
}

// ==========================================
// MOTOR V2 (Opcion B): CLONADO DE INDICADORES ENTRE PERIODOS
// Copia la estructura (categoria, descripcion, puntaje, puntosTotales) de los
// indicadores de un periodo de origen a un periodo de destino, para la misma
// materia. Nunca copia NOTAS -- el indicador clonado nace sin calificar.
// Si un indicador con la misma categoria+descripcion ya existe en el periodo
// destino, se omite (evita duplicar si se corre dos veces por error).
// idsIndicadores (opcional): lista puntual de IDs a clonar, para cuando el
// profe elige solo algunos en vez de todo el periodo de origen. Si se omite o
// viene vacia, se clona el periodo de origen completo (comportamiento previo).
// ==========================================
function clonarIndicadores(idMateria, periodoOrigen, periodoDestino, idsIndicadores) {
  try {
    if (String(periodoOrigen) === String(periodoDestino)) {
      return { error: "El periodo de origen y destino no pueden ser el mismo" };
    }

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName("INDICADORES");
    const data = sheet.getDataRange().getValues();

    const filtroIds = Array.isArray(idsIndicadores) && idsIndicadores.length > 0
      ? new Set(idsIndicadores.map(id => String(id).trim()))
      : null;

    const existentesDestino = new Set();
    const origen = [];
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]).trim() !== String(idMateria).trim()) continue;
      const periodoFila = String(data[i][7]);
      if (periodoFila === String(periodoDestino)) {
        existentesDestino.add(data[i][2] + "|" + data[i][3]);
      } else if (periodoFila === String(periodoOrigen)) {
        const idFila = String(data[i][0]).trim();
        if (!filtroIds || filtroIds.has(idFila)) origen.push(data[i]);
      }
    }

    if (origen.length === 0) {
      return { error: "No hay indicadores en el periodo de origen para esta materia" };
    }

    let clonados = 0, omitidos = 0;
    const nuevasFilas = [];
    const baseId = Date.now(); // una sola vez para todo el lote -- combinado con el indice de abajo alcanza para que no choquen, sin necesitar un UUID larguisimo
    origen.forEach((row, idx) => {
      const key = row[2] + "|" + row[3];
      if (existentesDestino.has(key)) { omitidos++; return; }
      nuevasFilas.push([
        "IND-" + baseId + "-" + idx,
        idMateria,
        row[2],              // categoria
        row[3],              // descripcion
        row[4],              // puntaje
        new Date(),           // fecha de clonado
        row[6] || 100,        // puntosTotales
        periodoDestino
      ]);
      clonados++;
    });

    if (nuevasFilas.length > 0) {
      const filaInicio = sheet.getLastRow() + 1;
      const rango = sheet.getRange(filaInicio, 1, nuevasFilas.length, nuevasFilas[0].length);
      rango.setValues(nuevasFilas);
      // setValues() en un rango nuevo no hereda el formato de fecha/hora de las filas
      // de arriba (a diferencia de appendRow) -- se fija explicito para que se vea
      // igual que el resto de la columna FECHA. Costa Rica usa dia/mes/año, no
      // mes/dia/año (formato que se habia puesto por error la primera vez).
      sheet.getRange(filaInicio, 6, nuevasFilas.length, 1).setNumberFormat("d/M/yyyy H:mm:ss");
    }

    return { success: true, clonados: clonados, omitidos: omitidos };
  } catch (e) { return { error: e.toString() }; }
}

// ==========================================
// MOTOR V2 (Opcion B): RECALCULAR PESOS DE COTIDIANO (accion explicita, bajo demanda)
// Congela de nuevo el %_OBTENIDO de TODAS las notas de Cotidiano YA calificadas de
// esta materia+periodo, usando el peso vigente actual (segun cuantos indicadores
// de Cotidiano existen HOY en ese periodo). Es la pieza que faltaba: sin esto, si
// el profe califica el indicador #1 (unico, pesa 40%) y despues agrega el #2
// (ahora pesan 20% c/u), el #1 se queda congelado en 40% para siempre y el total
// termina en 60% en vez de 40%. Se puede correr las veces que haga falta --
// siempre re-congela todo con el peso de HOY, es seguro repetirlo.
// ==========================================
function recalcularPesoCotidiano(idMateria, periodo) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const peso = calcularPesoCotidianoVigente(ss, idMateria, periodo);

    const dataInd = ss.getSheetByName("INDICADORES").getDataRange().getValues();
    const idsCotidianoPeriodo = new Set();
    for (let i = 1; i < dataInd.length; i++) {
      if (String(dataInd[i][1]).trim() === String(idMateria).trim()
          && String(dataInd[i][2]).trim() === "TRAB_COT"
          && String(dataInd[i][7]) === String(periodo)) {
        idsCotidianoPeriodo.add(String(dataInd[i][0]).trim());
      }
    }

    if (idsCotidianoPeriodo.size === 0) {
      return { error: "No hay indicadores de Cotidiano en ese periodo para esta materia" };
    }

    const sheet = ss.getSheetByName("NOTAS");
    const data = sheet.getDataRange().getValues();
    let actualizadas = 0;

    for (let i = 1; i < data.length; i++) {
      const idInd = String(data[i][1]).trim();
      if (!idsCotidianoPeriodo.has(idInd)) continue;

      const nivelRaw = parseFloat(data[i][5]);
      const nivel = isFinite(nivelRaw) ? nivelRaw : 0;
      const nuevoPorc = parseFloat(((nivel / 3) * peso).toFixed(2));

      data[i][3] = nuevoPorc;
      actualizadas++;
    }

    if (actualizadas > 0) {
      sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
    }

    return { success: true, actualizadas: actualizadas, pesoNuevo: parseFloat(peso.toFixed(2)) };
  } catch (e) { return { error: e.toString() }; }
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
          notaFinal = extraerPorcentaje(dataNota.nota);
       }
       else if (dataNota.nota !== "" && dataNota.nota !== null && dataNota.nota !== undefined) {
          let valorViejo = extraerPorcentaje(dataNota.nota);

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

// ==========================================
// MOTOR V2 (Opcion B): peso de Cotidiano FIJO al calificar
// El peso vigente (totalCotidianoMateria / cantidad de indicadores TRAB_COT que
// existen HOY) se calcula UNA sola vez, en este momento, y con eso se calcula y
// guarda el %_OBTENIDO. Los reportes (Boleta/Cuadro/SEA) ya NO recalculan nada:
// solo suman lo que quedo guardado aqui. Si despues se agregan mas indicadores
// de Cotidiano, las notas YA calificadas no cambian de valor -- solo lo nuevo que
// se califique de ahi en adelante usa el peso nuevo (recalcular el pasado es una
// migracion explicita, ver migrarNotasAMotorV2).
// ==========================================
// periodo: OBLIGATORIO desde que existen periodos -- el peso de Cotidiano de un
// indicador solo se reparte entre los indicadores DE SU MISMO periodo, nunca
// contando los de otros periodos de la misma materia (ese conteo mezclado fue
// el bug que infló a la mitad las notas de I Periodo al existir indicadores de
// II Periodo ya creados).
function calcularPesoCotidianoVigente(ss, idMateria, periodo) {
  const dataMat = ss.getSheetByName("MATERIAS").getDataRange().getValues();
  let totalCot = 0;
  for (let i = 1; i < dataMat.length; i++) {
    if (String(dataMat[i][0]).trim() === String(idMateria).trim()) { totalCot = Number(dataMat[i][3]) || 0; break; }
  }

  const dataInd = ss.getSheetByName("INDICADORES").getDataRange().getValues();
  let cantidad = 0;
  for (let i = 1; i < dataInd.length; i++) {
    if (String(dataInd[i][1]).trim() === String(idMateria).trim()
        && String(dataInd[i][2]).trim() === "TRAB_COT"
        && String(dataInd[i][7]) === String(periodo)) cantidad++;
  }
  return cantidad > 0 ? totalCot / cantidad : 0;
}

// ==========================================
// BITACORA DE CAMBIOS (soporte real a reclamos tipo "pase lista y no se guardo"
// o "cambie esta nota y no se refleja"). Enfocada SOLO en los dos puntos calientes
// -- Notas y Asistencia -- no en todo el sistema, para no llenar el Sheets de
// ruido que nadie va a revisar. Cada guardado de nota o marca de asistencia deja
// un rastro: quien, cuando, y el valor anterior -> nuevo. Se puede consultar
// despues con obtenerBitacoraCambios(idMateria).
// ==========================================
function registrarBitacoraCambio(ss, tipo, referencia, valorAnterior, valorNuevo, usuario) {
  try {
    let sheet = ss.getSheetByName("BITACORA_CAMBIOS");
    if (!sheet) {
      sheet = ss.insertSheet("BITACORA_CAMBIOS");
      sheet.appendRow(["ID", "FECHA_HORA", "USUARIO", "TIPO", "REFERENCIA", "VALOR_ANTERIOR", "VALOR_NUEVO"]);
    }
    sheet.appendRow([
      "BIT-" + Date.now() + Math.floor(Math.random() * 1000),
      new Date(),
      usuario || "desconocido",
      tipo,
      referencia,
      valorAnterior === undefined || valorAnterior === null ? "" : valorAnterior,
      valorNuevo === undefined || valorNuevo === null ? "" : valorNuevo
    ]);
  } catch (e) {
    // La bitacora nunca debe romper el guardado real -- si falla, solo se pierde el rastro, no la nota/asistencia.
    Logger.log("Error registrando bitacora: " + e.toString());
  }
}

// Historial completo (Notas + Asistencia) de una materia, mas reciente primero.
// idMateria se usa para filtrar NOTAS (via el indicador) y ASISTENCIA directo.
function obtenerBitacoraCambios(idMateria) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName("BITACORA_CAMBIOS");
    if (!sheet) return { success: true, lista: [] };

    const data = sheet.getDataRange().getValues();

    // Mapas de apoyo para mostrar nombres en vez de solo IDs
    const dataInd = ss.getSheetByName("INDICADORES").getDataRange().getValues();
    let mapIndDesc = {}, mapIndMateria = {};
    for (let i = 1; i < dataInd.length; i++) {
      const idInd = String(dataInd[i][0]).trim();
      mapIndDesc[idInd] = dataInd[i][3];
      mapIndMateria[idInd] = String(dataInd[i][1]).trim();
    }
    const dataEst = ss.getSheetByName("ESTUDIANTES").getDataRange().getValues();
    let mapEstNombre = {};
    for (let i = 1; i < dataEst.length; i++) mapEstNombre[String(dataEst[i][0]).trim()] = dataEst[i][3];

    let lista = [];
    for (let i = 1; i < data.length; i++) {
      const tipo = data[i][3];
      const referencia = String(data[i][4]);
      let coincide = false, detalle = "";

      if (tipo === "NOTA") {
        const [idInd, idEst] = referencia.split("|");
        if (mapIndMateria[idInd] === String(idMateria).trim()) {
          coincide = true;
          detalle = `${mapIndDesc[idInd] || idInd} — ${mapEstNombre[idEst] || idEst}`;
        }
      } else if (tipo === "ASISTENCIA") {
        const [idMat, idEst, fecha] = referencia.split("|");
        if (String(idMat).trim() === String(idMateria).trim()) {
          coincide = true;
          detalle = `Asistencia ${fecha} — ${mapEstNombre[idEst] || idEst}`;
        }
      }

      if (coincide) {
        lista.push({
          fecha: Utilities.formatDate(new Date(data[i][1]), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss"),
          usuario: data[i][2],
          tipo: tipo,
          detalle: detalle,
          anterior: data[i][5],
          nuevo: data[i][6]
        });
      }
    }

    lista.reverse(); // mas reciente primero
    return { success: true, lista: lista };
  } catch (e) { return { error: e.toString() }; }
}

function generarPdfBitacoraCambios(idMateria) {
  try {
    const datos = obtenerBitacoraCambios(idMateria);
    if (datos.error) return { success: false, message: datos.error };

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const dataMat = ss.getSheetByName("MATERIAS").getDataRange().getValues();
    let nombreMateria = idMateria;
    for (let i = 1; i < dataMat.length; i++) {
      if (String(dataMat[i][0]) === String(idMateria)) { nombreMateria = dataMat[i][2]; break; }
    }

    const ETIQUETA_TIPO = { NOTA: "Nota", ASISTENCIA: "Asistencia" };

    let filas = "";
    datos.lista.forEach(h => {
      const anteriorTxt = (h.anterior === "" || h.anterior === null || h.anterior === undefined) ? "— (nuevo)" : h.anterior;
      filas += `
      <tr>
        <td style="border:1px solid #ddd; padding:5px; font-size:10px; white-space:nowrap;">${h.fecha}</td>
        <td style="border:1px solid #ddd; padding:5px; font-size:10px;">${h.usuario}</td>
        <td style="border:1px solid #ddd; padding:5px; font-size:10px; text-align:center;">${ETIQUETA_TIPO[h.tipo] || h.tipo}</td>
        <td style="border:1px solid #ddd; padding:5px; font-size:10px;">${h.detalle}</td>
        <td style="border:1px solid #ddd; padding:5px; font-size:10px; text-align:center;">${anteriorTxt} → <b>${h.nuevo}</b></td>
      </tr>`;
    });

    if (datos.lista.length === 0) {
      filas = `<tr><td colspan="5" style="border:1px solid #ddd; padding:10px; font-size:10px; text-align:center; color:#999;">Sin cambios registrados.</td></tr>`;
    }

    let html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
         <h3 style="text-align:center; color:#004E64; margin-bottom:5px;">HISTORIAL DE CAMBIOS</h3>
         <h4 style="text-align:center; margin-top:0; color:#555;">${nombreMateria}</h4>

         <table style="width:100%; border-collapse:collapse; margin-top:20px;">
            <thead>
                <tr style="background-color:#004E64; color:white; font-size:11px;">
                   <th style="padding:5px; text-align:left;">FECHA/HORA</th>
                   <th style="padding:5px; text-align:left;">USUARIO</th>
                   <th style="padding:5px;">TIPO</th>
                   <th style="padding:5px; text-align:left;">DETALLE</th>
                   <th style="padding:5px;">CAMBIO</th>
                </tr>
            </thead>
            <tbody>${filas}</tbody>
         </table>
      </div>
    `;

    const blob = Utilities.newBlob(html, MimeType.HTML).getAs(MimeType.PDF);
    blob.setName(`Historial_${nombreMateria}.pdf`);
    return { success: true, base64: Utilities.base64Encode(blob.getBytes()), nombre: blob.getName() };

  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function guardarCalificaciones(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("NOTAS");
  const fechaActual = formatearFechaInput(new Date());
  const indId = String(data.idIndicador).trim();

  // Leer indicador desde Sheets para calcular % con datos autoritativos
  const dataInd = ss.getSheetByName("INDICADORES").getDataRange().getValues();
  let puntajeInd = 0, puntosTotalesInd = 100, esCotidianoInd = false, idMateriaInd = null, periodoInd = null;
  for (let k = 1; k < dataInd.length; k++) {
    if (String(dataInd[k][0]).trim() === indId) {
      esCotidianoInd = String(dataInd[k][2]).trim() === "TRAB_COT";
      puntajeInd     = parseFloat(dataInd[k][4]) || 0;
      puntosTotalesInd = parseFloat(dataInd[k][6]) || 100;
      idMateriaInd = String(dataInd[k][1]).trim();
      periodoInd = dataInd[k][7];
      break;
    }
  }

  // MOTOR V2 (Opcion B): para Cotidiano, el peso NO se toma del campo "puntaje"
  // guardado en el indicador (puede quedar desactualizado si se agregan mas
  // indicadores despues) -- se recalcula el peso vigente UNA vez aqui y se congela.
  // Se reparte SOLO entre los indicadores del MISMO periodo (ver calcularPesoCotidianoVigente).
  const pesoCotFijo = esCotidianoInd ? calcularPesoCotidianoVigente(ss, idMateriaInd, periodoInd) : 0;

  const dataNotas = sheet.getDataRange().getValues();

  data.lista.forEach(i => {
    let fila = -1;
    let estId = String(i.idEst).trim();
    const nivelBruto = parseFloat(i.nivel);

    // Calcular % en backend para evitar dependencia del estado del frontend
    let porcObtenido;
    if (esCotidianoInd) {
      porcObtenido = parseFloat(((nivelBruto / 3) * pesoCotFijo).toFixed(2));
    } else {
      porcObtenido = parseFloat(((nivelBruto / puntosTotalesInd) * puntajeInd).toFixed(2));
    }

    let nivelAnterior = null;
    for(let r = 1; r < dataNotas.length; r++) {
      if(String(dataNotas[r][1]).trim() === indId && String(dataNotas[r][2]).trim() === estId) {
        fila = r + 1;
        nivelAnterior = dataNotas[r][5];
        break;
      }
    }

    if(fila > -1) {
      // Forzamos formato numérico plano: si la celda quedó con formato de Fecha/Hora
      // por algún motivo, Sheets seguiría devolviendo un objeto Date al leerla.
      sheet.getRange(fila, 4).setNumberFormat('0.00').setValue(porcObtenido);
      sheet.getRange(fila, 5).setValue(fechaActual);
      sheet.getRange(fila, 6).setNumberFormat('0.00').setValue(nivelBruto);

      // BITACORA: solo si el nivel realmente cambio -- vuelve a guardar el mismo
      // valor (re-abrir y confirmar sin tocar nada) no genera ruido.
      if (String(nivelAnterior) !== String(nivelBruto)) {
        registrarBitacoraCambio(ss, "NOTA", indId + "|" + estId, nivelAnterior, nivelBruto, data.email);
      }
    } else {
      sheet.appendRow([
        "NOTE-" + Date.now() + Math.floor(Math.random() * 1000),
        indId,
        estId,
        porcObtenido,
        fechaActual,
        nivelBruto
      ]);
      registrarBitacoraCambio(ss, "NOTA", indId + "|" + estId, "", nivelBruto, data.email);

      const filaNueva = sheet.getLastRow();
      sheet.getRange(filaNueva, 4).setNumberFormat('0.00');
      sheet.getRange(filaNueva, 6).setNumberFormat('0.00');

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

// Detecta bloques de horario que caen HOY y aún no tienen ninguna marca de asistencia registrada
// Revisa HOY y los últimos VENTANA_DIAS hacia atrás: cualquier día de clase (según CONF_HORARIO)
// que se haya quedado sin ninguna marca de asistencia, salvo que el día esté marcado como "sin clases"
// (feriado/evento) en DIAS_NO_LECTIVOS.
function obtenerAlertasAsistenciaPendiente(email, fechaHoy) {
  try {
    const VENTANA_DIAS = 7;
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const idUsuario = String(obtenerIdUsuarioPorEmail(email)).trim();
    if (!idUsuario || !fechaHoy) return [];

    const diasMap = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    const [y, m, d] = fechaHoy.split('-').map(Number);
    const hoyDate = new Date(y, m - 1, d);

    const dataSecc = ss.getSheetByName("SECCIONES").getDataRange().getValues();
    let mapaSec = {};
    for (let i = 1; i < dataSecc.length; i++) {
      if (String(dataSecc[i][6]).trim() === idUsuario) mapaSec[dataSecc[i][0]] = dataSecc[i][2];
    }
    if (Object.keys(mapaSec).length === 0) return [];

    const dataMat = ss.getSheetByName("MATERIAS").getDataRange().getValues();
    let mapaMat = {};
    for (let i = 1; i < dataMat.length; i++) mapaMat[dataMat[i][0]] = dataMat[i][2];

    // Días marcados manualmente como "sin clases" (feriado/evento), por materia+fecha
    const sheetNL = ss.getSheetByName("DIAS_NO_LECTIVOS");
    let noLectivos = {};
    if (sheetNL) {
      const dataNL = sheetNL.getDataRange().getValues();
      for (let i = 1; i < dataNL.length; i++) {
        noLectivos[String(dataNL[i][1]).trim() + "|" + formatearFechaInput(dataNL[i][2])] = true;
      }
    }

    // Set de "idMateria|fecha" que ya tienen alguna marca de asistencia
    const sheetAsis = ss.getSheetByName("ASISTENCIA_DATA");
    const dataAsis = sheetAsis ? sheetAsis.getDataRange().getValues() : [];
    let materiasConMarca = {};
    for (let i = 1; i < dataAsis.length; i++) {
      materiasConMarca[String(dataAsis[i][3]).trim() + "|" + formatearFechaInput(dataAsis[i][1])] = true;
    }

    const dataCfg = ss.getSheetByName("CONF_HORARIO").getDataRange().getValues();
    let pendientes = [];

    for (let i = 1; i < dataCfg.length; i++) {
      const idSec = String(dataCfg[i][1]);
      if (!mapaSec[idSec]) continue;

      const idMateria = String(dataCfg[i][2]);
      const ini = formatearFechaInput(dataCfg[i][3]);
      const fin = formatearFechaInput(dataCfg[i][4]);

      let dias = {};
      try { dias = JSON.parse(dataCfg[i][5]); } catch (e) { dias = {}; }

      for (let offset = 0; offset <= VENTANA_DIAS; offset++) {
        const fechaCheck = new Date(hoyDate.getTime());
        fechaCheck.setDate(fechaCheck.getDate() - offset);
        const fechaStr = Utilities.formatDate(fechaCheck, Session.getScriptTimeZone(), "yyyy-MM-dd");

        if (fechaStr < ini || fechaStr > fin) continue;

        const nombreDia = diasMap[fechaCheck.getDay()];
        if (!dias[nombreDia]) continue; // no era día de clase para esa materia

        if (noLectivos[idMateria + "|" + fechaStr]) continue; // marcado manualmente como sin clases
        if (materiasConMarca[idMateria + "|" + fechaStr]) continue; // ya tiene asistencia marcada

        pendientes.push({
          idSeccion: idSec,
          nomSeccion: mapaSec[idSec],
          idMateria: idMateria,
          nomMateria: mapaMat[idMateria] || "Materia Borrada",
          fecha: fechaStr
        });
      }
    }

    return pendientes;
  } catch (e) { return { error: e.toString() }; }
}

// Marca (o actualiza el motivo de) un día como "sin clases" para una materia — feriado, evento, etc.
function guardarDiaNoLectivo(form) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName("DIAS_NO_LECTIVOS");
    if (!sheet) {
      sheet = ss.insertSheet("DIAS_NO_LECTIVOS");
      sheet.appendRow(["ID", "ID_MATERIA_FK", "FECHA", "MOTIVO", "ID_USUARIO_FK"]);
    }
    const idUsuario = obtenerIdUsuarioPorEmail(form.email);
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]).trim() === String(form.idMateria).trim() &&
          formatearFechaInput(data[i][2]) === form.fecha) {
        sheet.getRange(i + 1, 4).setValue(form.motivo || "");
        return { success: true, message: "Día actualizado." };
      }
    }

    sheet.appendRow(["NL-" + Date.now(), form.idMateria, form.fecha, form.motivo || "", idUsuario]);
    return { success: true, message: "Día marcado como sin clases." };
  } catch (e) { return { success: false, message: e.toString() }; }
}

function eliminarDiaNoLectivo(idMateria, fecha) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName("DIAS_NO_LECTIVOS");
    if (!sheet) return { success: false };
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]).trim() === String(idMateria).trim() && formatearFechaInput(data[i][2]) === fecha) {
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    return { success: false };
  } catch (e) { return { success: false, message: e.toString() }; }
}

// Trae los días "sin clases" configurados para una materia (para pintarlos distinto en la matriz)
function obtenerDiasNoLectivos(idMateria) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName("DIAS_NO_LECTIVOS");
    if (!sheet) return [];
    const data = sheet.getDataRange().getValues();
    let lista = [];
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]).trim() === String(idMateria).trim()) {
        lista.push({ fecha: formatearFechaInput(data[i][2]), motivo: data[i][3] });
      }
    }
    return lista;
  } catch (e) { return []; }
}

// Trae TODOS los horarios del docente (todas las instituciones/secciones), para la vista de consulta
function obtenerTodosLosHorarios(email) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const idUsuario = String(obtenerIdUsuarioPorEmail(email)).trim();
    if (!idUsuario) return [];

    const dataInst = ss.getSheetByName("INSTITUCIONES").getDataRange().getValues();
    let mapaInst = {};
    for (let i = 1; i < dataInst.length; i++) mapaInst[dataInst[i][0]] = dataInst[i][1];

    const dataSecc = ss.getSheetByName("SECCIONES").getDataRange().getValues();
    let mapaSec = {};
    for (let i = 1; i < dataSecc.length; i++) {
      if (String(dataSecc[i][6]).trim() === idUsuario) {
        mapaSec[dataSecc[i][0]] = { nombre: dataSecc[i][2], idInst: dataSecc[i][1] };
      }
    }

    const sheetMat = ss.getSheetByName("MATERIAS");
    const dataMat = sheetMat ? sheetMat.getDataRange().getValues() : [];
    let mapaMat = {};
    for (let i = 1; i < dataMat.length; i++) mapaMat[dataMat[i][0]] = dataMat[i][2];

    const sheet = ss.getSheetByName("CONF_HORARIO");
    if (!sheet) return [];
    const data = sheet.getDataRange().getValues();

    let lista = [];
    for (let i = 1; i < data.length; i++) {
      const idSec = String(data[i][1]);
      const sec = mapaSec[idSec];
      if (!sec) continue; // no pertenece a este docente

      lista.push({
        id: data[i][0],
        idSeccion: idSec,
        nomSeccion: sec.nombre,
        idInstitucion: sec.idInst,
        nomInstitucion: mapaInst[sec.idInst] || "Desconocida",
        idMateria: data[i][2],
        nomMateria: mapaMat[data[i][2]] || "Materia Borrada",
        ini: formatearFechaInput(data[i][3]),
        fin: formatearFechaInput(data[i][4]),
        dias: JSON.parse(data[i][5])
      });
    }
    return lista;
  } catch (e) { return { error: e.toString() }; }
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

    const referenciaBit = payload.idMateria + "|" + payload.idEst + "|" + fechaInput;

    if(filasEncontradas.length > 0) {
      const estadoAnterior = data[filasEncontradas[0] - 1][4];
      sheet.getRange(filasEncontradas[0], 5).setValue(payload.estado);

      for(let k = filasEncontradas.length - 1; k >= 1; k--) {
        sheet.deleteRow(filasEncontradas[k]);
      }

      if (String(estadoAnterior) !== String(payload.estado)) {
        registrarBitacoraCambio(ss, "ASISTENCIA", referenciaBit, estadoAnterior, payload.estado, payload.email);
      }
    } else {
      sheet.appendRow(["AS-" + Date.now(), payload.fecha, payload.idEst, payload.idMateria, payload.estado, idUser]);
      registrarBitacoraCambio(ss, "ASISTENCIA", referenciaBit, "", payload.estado, payload.email);
    }

    return { success: true };

 } finally {
    SpreadsheetApp.flush();
    lock.releaseLock();
  }
}

function guardarMarcaAsistenciaBatch(payload) {
  // payload.marcas = [{idEst, idMateria, fecha, estado}, ...]
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName("ASISTENCIA_DATA");
    if(!sheet) {
      sheet = ss.insertSheet("ASISTENCIA_DATA");
      sheet.appendRow(["ID", "FECHA", "ID_EST", "ID_MAT", "ESTADO", "USER"]);
    }
    const data = sheet.getDataRange().getValues();
    const marcas = payload.marcas || [];

    marcas.forEach(m => {
      const fechaInput = formatearFechaInput(m.fecha);
      let filasEncontradas = [];
      for(let i = 1; i < data.length; i++){
        if(String(data[i][2]) == String(m.idEst) &&
           String(data[i][3]) == String(m.idMateria) &&
           formatearFechaInput(data[i][1]) == fechaInput) {
          filasEncontradas.push(i + 1);
        }
      }
      const referenciaBit = m.idMateria + "|" + m.idEst + "|" + fechaInput;

      if(filasEncontradas.length > 0) {
        const estadoAnterior = data[filasEncontradas[0] - 1][4];
        sheet.getRange(filasEncontradas[0], 5).setValue(m.estado);
        if (String(estadoAnterior) !== String(m.estado)) {
          registrarBitacoraCambio(ss, "ASISTENCIA", referenciaBit, estadoAnterior, m.estado, payload.email);
        }
      } else {
        const newRow = ["AS-" + Date.now() + Math.random(), m.fecha, m.idEst, m.idMateria, m.estado, payload.email];
        sheet.appendRow(newRow);
        data.push(newRow); // Actualizar copia local para próximas iteraciones
        registrarBitacoraCambio(ss, "ASISTENCIA", referenciaBit, "", m.estado, payload.email);
      }
    });

    return { success: true, saved: marcas.length };
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

// Incidencias "Abiertas" cuyo recordatorio ya llegó (o pasó) — para la Alerta del Día
function obtenerIncidenciasPendientes(email) {
  try {
    const lista = obtenerBitacoras(email);
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);

    return lista.filter(b => {
      if (b.estado !== 'Abierto') return false;
      if (!b.recordatorio) return false;
      const parts = b.recordatorio.split('-');
      const fAlert = new Date(parts[0], parts[1] - 1, parts[2]);
      return fAlert <= hoy;
    }).map(b => ({
      id: b.id,
      nombreSeccion: b.nombreSeccion,
      nombreEstudiante: b.nombreEstudiante,
      tipo: b.tipo,
      desc: b.desc,
      fecha: b.fecha
    }));
  } catch (e) { return []; }
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
    const dataEst = ss.getSheetByName("ESTUDIANTES").getDataRange().getValues();
    const dataNotas = ss.getSheetByName("NOTAS").getDataRange().getValues();

    let mapMatName = {};
    let mapMatToSec = {};
    dataMat.forEach(r => { mapMatName[r[0]] = r[2]; mapMatToSec[r[0]] = r[1]; });

    let mapSecToInst = {};
    dataSec.forEach(r => mapSecToInst[r[0]] = r[1]);

    let mapInd = {};
    dataInd.forEach(r => mapInd[r[0]] = r[3] + " (" + r[2] + ")");

    // Total de estudiantes activos (no eximidos) por sección, para calcular entregas
    let mapEstudiantesPorSeccion = {};
    for (let i = 1; i < dataEst.length; i++) {
      const sec = String(dataEst[i][1]).trim();
      const esEximido = String(dataEst[i][11]).toUpperCase().trim() === "TRUE";
      if (!esEximido) mapEstudiantesPorSeccion[sec] = (mapEstudiantesPorSeccion[sec] || 0) + 1;
    }

    // Estudiantes con nota registrada por indicador, para saber cuántos "entregaron" una Tarea
    let mapEntregasPorIndicador = {};
    for (let i = 1; i < dataNotas.length; i++) {
      const idInd = String(dataNotas[i][1]).trim();
      const idEst = String(dataNotas[i][2]).trim();
      const nota = dataNotas[i][3];
      const nivel = dataNotas[i][5];
      const tieneNota = (nota !== "" && nota !== null && nota !== undefined) || (nivel !== "" && nivel !== null && nivel !== undefined);
      if (tieneNota) {
        if (!mapEntregasPorIndicador[idInd]) mapEntregasPorIndicador[idInd] = new Set();
        mapEntregasPorIndicador[idInd].add(idEst);
      }
    }

    let lista = [];
    for(let i=1; i<data.length; i++){
      if(String(data[i][7]) == String(idUsuario)){
         let idMat = data[i][1];
         let idSec = mapMatToSec[idMat];

         let tipo = data[i][9] ? String(data[i][9]) : "Clase";
         let idInd = data[i][10] ? String(data[i][10]) : "";

         let totalEstudiantes = mapEstudiantesPorSeccion[String(idSec).trim()] || 0;
         let entregados = (tipo === "Tarea" && idInd && mapEntregasPorIndicador[idInd]) ? mapEntregasPorIndicador[idInd].size : 0;

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
           nombreIndicador: mapInd[idInd] || "Sin vincular",
           entregados: entregados,
           totalEstudiantes: totalEstudiantes
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

function compartirLeccionPorCorreo(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const dataAula = ss.getSheetByName("MIAULA").getDataRange().getValues();

  let leccion = null;
  for (let i = 1; i < dataAula.length; i++) {
    if (String(dataAula[i][0]).trim() === String(data.id).trim()) {
      leccion = {
        idMateria: dataAula[i][1],
        titulo: dataAula[i][2],
        desc: dataAula[i][3],
        fileUrl: dataAula[i][4],
        link: dataAula[i][5],
        tipo: dataAula[i][9] ? String(dataAula[i][9]) : "Clase"
      };
      break;
    }
  }
  if (!leccion) return { success: false, message: "No se encontró el contenido." };

  const dataMat = ss.getSheetByName("MATERIAS").getDataRange().getValues();
  let idSeccion = "", nombreMateria = "General";
  for (let i = 1; i < dataMat.length; i++) {
    if (String(dataMat[i][0]).trim() === String(leccion.idMateria).trim()) {
      idSeccion = dataMat[i][1];
      nombreMateria = dataMat[i][2];
      break;
    }
  }

  let estudiantes = obtenerEstudiantes(idSeccion);
  if (data.ids && data.ids.length > 0) {
    const idsSet = new Set(data.ids.map(x => String(x).trim()));
    estudiantes = estudiantes.filter(e => idsSet.has(String(e.id).trim()));
  }
  const nombreProfe = data.nombreDocente || "Docente a cargo";
  const emailProfe = data.emailDocente || Session.getActiveUser().getEmail();
  const nombreRemitente = nombreProfe + " - RegistraME";

  const tipoTexto = leccion.tipo === "Tarea" ? "una nueva tarea" : "nuevo material de clase";
  let cuerpo = `Estimada familia:\n\n${data.mensaje ? data.mensaje + "\n\n" : ""}` +
    `Se ha publicado ${tipoTexto} en ${nombreMateria}:\n\n"${leccion.titulo}"\n${leccion.desc || ""}\n`;
  if (leccion.fileUrl) cuerpo += `\nArchivo: ${leccion.fileUrl}\n`;
  if (leccion.link) cuerpo += `\nEnlace: ${leccion.link}\n`;
  cuerpo += `\nAtentamente,\n${nombreProfe}`;

  const asunto = (leccion.tipo === "Tarea" ? "Nueva Tarea" : "Nuevo Material") + " - " + leccion.titulo;

  let enviados = 0, fallidos = 0, erroresDetallados = [];

  estudiantes.forEach(e => {
    if (e.eximido) return;
    try {
      const email = e.emailEnc;
      if (!email || !String(email).includes("@")) throw new Error("Correo inválido o vacío.");

      GmailApp.sendEmail(email, asunto, cuerpo, {
        name: nombreRemitente,
        replyTo: emailProfe
      });
      enviados++;
    } catch (err) {
      fallidos++;
      erroresDetallados.push(`• ${e.nombre}: ${err.message}`);
    }
  });

  let mensajeFinal = `Proceso finalizado. Enviados: ${enviados}`;
  if (fallidos > 0) mensajeFinal += ` | Fallidos: ${fallidos}\n${erroresDetallados.join("\n")}`;

  return { success: true, message: mensajeFinal, enviados: enviados, fallidos: fallidos };
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
// HELPER: extrae un % numérico de una celda de NOTAS aunque Sheets la haya
// guardado con formato de Fecha/Hora en vez de Número (bug real detectado:
// una celda de %_OBTENIDO quedó como fecha y Apps Script la devuelve como
// objeto Date en vez de número, haciendo que parseFloat() diera NaN -> 0).
// ==========================================
function extraerPorcentaje(valor) {
  if (valor instanceof Date) {
    const epocaSheets = new Date(Date.UTC(1899, 11, 30));
    return (valor.getTime() - epocaSheets.getTime()) / 86400000;
  }
  const num = parseFloat(valor);
  return isFinite(num) ? num : 0;
}

// ==========================================
// ASISTENCIA POR ESTUDIANTE Y MATERIA
// ==========================================
// NOTA: el porcentaje ya NO se calcula aqui con una formula propia (antes era
// un simple P/total que ni siquiera contaba las justificadas -- buscaba la
// clave "AJ", que el registro real nunca guarda, solo guarda "J"). Ahora
// reutiliza calcularAsistenciaMap, la misma funcion autoritativa que usan la
// Matriz y los reportes, para que los 3 lugares del sistema digan lo mismo.
function obtenerAsistenciaEstudiante(idEstudiante, idMateria) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheetAsis = ss.getSheetByName("ASISTENCIA_DATA");
    if(!sheetAsis) return { success: true, conteo: { P:0, AI:0, T:0, J:0, E:0 }, total: 0, porcentaje: 100 };

    const data = sheetAsis.getDataRange().getValues();
    let conteo = { P:0, AI:0, T:0, J:0, E:0 };

    for(let i=1; i<data.length; i++) {
      if(String(data[i][2]).trim() === String(idEstudiante).trim() &&
         String(data[i][3]).trim() === String(idMateria).trim()) {
        let estado = String(data[i][4]).trim().toUpperCase();
        if(conteo[estado] !== undefined) conteo[estado]++;
      }
    }

    let total = conteo.P + conteo.AI + conteo.T + conteo.J + conteo.E;

    const dataMat = ss.getSheetByName("MATERIAS").getDataRange().getValues();
    let valorAsist = 0;
    for (let i = 1; i < dataMat.length; i++) {
      if (String(dataMat[i][0]).trim() === String(idMateria).trim()) { valorAsist = Number(dataMat[i][7]) || 0; break; }
    }
    const mapa = calcularAsistenciaMap(idMateria, valorAsist);
    const porcentaje = mapa[String(idEstudiante).trim()] !== undefined ? mapa[String(idEstudiante).trim()] : valorAsist;

    return { success: true, conteo: conteo, total: total, porcentaje: porcentaje };
  } catch(e) { return { error: e.toString() }; }
}

// ==========================================
// REPORTES AVANZADOS (BOLETA Y CUADRO)
// ==========================================

function obtenerBoletaEstudiante(idEstudiante, periodo) {
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

    // Filtro de periodo (opcional): indicadores viejos sin periodo asignado
    // solo aparecen cuando no se pide un periodo especifico.
    if (periodo !== undefined && periodo !== null && periodo !== '') {
      indMateria = indMateria.filter(ind => String(ind[7]) === String(periodo));
    }

    // MOTOR V2 (Opcion B): el %_OBTENIDO de TRAB_COT ya quedo congelado con el
    // peso vigente al momento de calificar (ver guardarCalificaciones / calcularPesoCotidianoVigente).
    // Aqui ya NO se recalcula nada -- se suma igual que cualquier otra categoria.
    indMateria.forEach(ind => {
       let idInd = String(ind[0]).trim();
       let cat = ind[2];

       let notaEncontrada = null;
       for(let n=1; n<dataNotas.length; n++) {
         if(String(dataNotas[n][1]).trim() == idInd && String(dataNotas[n][2]).trim() == est.id) {
            notaEncontrada = extraerPorcentaje(dataNotas[n][3]); // se queda con la última fila (la más reciente)
         }
       }
       if(notaEncontrada !== null && acumulado[cat] !== undefined) acumulado[cat] += notaEncontrada;
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

function obtenerCuadroMateria(idMateria, periodo) {
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
    const filtrarPorPeriodo = periodo !== undefined && periodo !== null && periodo !== '';

    for(let i=1; i<dataInd.length; i++) {
       if(String(dataInd[i][1]).trim() == String(idMateria).trim()) {
           if (filtrarPorPeriodo && String(dataInd[i][7]) !== String(periodo)) continue;
           let idInd = String(dataInd[i][0]).trim();
           mapIndCat[idInd] = dataInd[i][2];
           if(dataInd[i][2] === 'ASIST') tieneIndAsistencia = true;
       }
    }

    // MOTOR V2 (Opcion B): el %_OBTENIDO de TRAB_COT ya quedo congelado con el
    // peso vigente al momento de calificar -- ya no se recalcula peso dinamico aqui.

    let mapAsist = {};
    let valorAsistTotal = Number(materia.valorAsist) || 0;
    if(!tieneIndAsistencia) {
        mapAsist = calcularAsistenciaMap(idMateria, valorAsistTotal);
    }

    estudiantes.forEach(e => {
       e.notas = { 'TRAB_COT':0, 'TAREAS':0, 'PRUEBAS':0, 'PROYECTOS':0, 'ASIST':0 };
       let notaPorIndicador = {}; // última fila encontrada por indicador (misma regla que la pantalla de calificar)
       for(let n=1; n<dataNotas.length; n++) {
          let idInd = String(dataNotas[n][1]).trim();
          if(String(dataNotas[n][2]).trim() == String(e.id) && mapIndCat[idInd]) {
             let cat = mapIndCat[idInd];
             let nota = extraerPorcentaje(dataNotas[n][3]);
             notaPorIndicador[idInd] = { cat: cat, nota: nota };
          }
       }
       Object.values(notaPorIndicador).forEach(v => { e.notas[v.cat] += v.nota; });

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

function obtenerDatosReporteSEA(idMateria, periodo) {
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
    let tieneIndAsistencia = false;
    const filtrarPorPeriodo = periodo !== undefined && periodo !== null && periodo !== '';

    for(let i=1; i<dataInd.length; i++) {
       if(String(dataInd[i][1]).trim() == String(idMateria).trim()) {
         if (filtrarPorPeriodo && String(dataInd[i][7]) !== String(periodo)) continue;
         let idInd = String(dataInd[i][0]).trim();
         mapIndCat[idInd] = dataInd[i][2];
         if(dataInd[i][2] === 'ASIST') tieneIndAsistencia = true;
       }
    }

    // MOTOR V2 (Opcion B): el %_OBTENIDO de TRAB_COT ya quedo congelado con el
    // peso vigente al momento de calificar -- Cuadro, Boleta y SEA ahora comparten
    // el mismo dato guardado, no 3 recalculos independientes.

    let mapAsist = {};
    let valAsistTotal = Number(valorAsist) || 0;
    if(!tieneIndAsistencia) mapAsist = calcularAsistenciaMap(idMateria, valAsistTotal);

    let reporte =[];
    estudiantes.forEach(est => {
       let notas = { 'TRAB_COT':0, 'TAREAS':0, 'PRUEBAS':0, 'PROYECTOS':0, 'ASIST':0 };
       let notaPorIndicador = {}; // última fila encontrada por indicador (misma regla que la pantalla de calificar)

       for(let n=1; n<dataNotas.length; n++) {
          let idInd = String(dataNotas[n][1]).trim();
          let idEstNota = String(dataNotas[n][2]).trim();
          if(idEstNota == est.id && mapIndCat[idInd]) {
            let cat = mapIndCat[idInd];
            let nota = extraerPorcentaje(dataNotas[n][3]);
            notaPorIndicador[idInd] = { cat: cat, nota: nota };
          }
       }
       Object.values(notaPorIndicador).forEach(v => { notas[v.cat] += v.nota; });

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

// Genera un .xlsx REAL (no el truco de HTML-como-Excel que usaba el frontend antes,
// que rompia tildes/enes y que otras plataformas rechazaban por no ser un Excel de verdad).
// Crea una Hoja de Google temporal solo para exportarla como xlsx, y la borra enseguida.
function generarExcelReporteSEA(idMateria, periodo) {
  let tempId = null;
  try {
    const datos = obtenerDatosReporteSEA(idMateria, periodo);
    if (datos.error) return { success: false, message: datos.error };

    const tempSS = SpreadsheetApp.create("SEA_temp_" + Date.now());
    tempId = tempSS.getId();
    const sheet = tempSS.getSheets()[0];
    sheet.setName("Reporte SEA");

    const encabezados = ["Id", "Nombre", "Trabajo cotidiano", "Tareas", "Prueba", "Asistencia"];
    sheet.getRange(1, 1, 1, encabezados.length).setValues([encabezados]);

    const filas = datos.lista.map(r => [r.Id, r.Nombre, r.Cotidiano, r.Tareas, r.Prueba, r.Asistencia]);
    if (filas.length > 0) sheet.getRange(2, 1, filas.length, encabezados.length).setValues(filas);
    SpreadsheetApp.flush();

    const url = "https://docs.google.com/spreadsheets/d/" + tempId + "/export?format=xlsx";
    const token = ScriptApp.getOAuthToken();
    const respuesta = UrlFetchApp.fetch(url, { headers: { Authorization: "Bearer " + token } });
    const blob = respuesta.getBlob();

    const nombreFinal = "SEA_" + String(datos.materia).replace(/\s+/g, "_") + ".xlsx";
    return { success: true, base64: Utilities.base64Encode(blob.getBytes()), nombre: nombreFinal };

  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    // Pase lo que pase (exito o error), el archivo temporal nunca debe quedar en el Drive.
    if (tempId) { try { DriveApp.getFileById(tempId).setTrashed(true); } catch (e2) {} }
  }
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

   // Peso de cada estado sobre las lecciones perdidas ese día:
   // AI (ausencia injustificada) = 1 leccion completa perdida.
   // T (tardia, 0-10 min desde el inicio) = media leccion perdida -- una tardia
   // pasados los 10 min ya se marca directo como AI, no como T.
   // E (escapada) y J (justificada) NO restan puntos (igual que "Presente").
   const PESO_ESTADO = { 'AI': 1, 'T': 0.5 };

   for(let i=1; i<dataAsis.length; i++) {
     const estado = dataAsis[i][4];
     const peso = PESO_ESTADO[estado];
     if(String(dataAsis[i][3]).trim() === String(idMateria).trim() && peso) {
        let idEst = String(dataAsis[i][2]).trim();
        let fecha = new Date(dataAsis[i][1]);
        let dName = diasMap[fecha.getDay()];

        let ptsPerdidos = 0;
        configs.forEach(cfg => {
           if(fecha >= cfg.ini && fecha <= cfg.fin && cfg.dias[dName]) {
              ptsPerdidos = Number(cfg.dias[dName]) * peso;
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

// ==========================================
// KPIs POR MATERIA (panel al entrar a una asignatura)
// Reutiliza funciones ya existentes y confiables (obtenerCuadroMateria,
// calcularAsistenciaMap) en vez de recalcular todo de cero -- misma logica que
// ya usan Cuadro/Boleta/SEA, para no crear una cuarta fuente de verdad.
// ==========================================
function getMateriaKPIs(idMateria) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);

    const dataMat = ss.getSheetByName("MATERIAS").getDataRange().getValues();
    let materia = null;
    for (let i = 1; i < dataMat.length; i++) {
      if (String(dataMat[i][0]).trim() === String(idMateria).trim()) {
        materia = {
          id: dataMat[i][0], nombre: dataMat[i][2],
          asistencia: Number(dataMat[i][7]) || 0,
          notaMinima: Number(dataMat[i][8]) || 65
        };
        break;
      }
    }
    if (!materia) return { error: "Materia no encontrada" };

    // 1. Promedio, distribucion y estudiantes en riesgo (a partir del Cuadro ya existente)
    const cuadro = obtenerCuadroMateria(idMateria);
    if (cuadro.error) return { error: cuadro.error };

    // Ampliación: la nota de cada estudiante se topa/ajusta antes de clasificar
    // aprobado/reprobado, para que "en riesgo" y el promedio reflejen la
    // realidad una vez aplicado el examen extraordinario (ver aplicarTopeAmpliacion).
    const ampliaciones = obtenerAmpliacionesPorMateria(ss, idMateria);

    let sumaTotal = 0;
    const distribucion = { excelente: 0, aprobado: 0, reprobado: 0 };
    const enRiesgo = [];

    cuadro.lista.forEach(e => {
      const intentosEst = ampliaciones[e.id];
      const resultado = aplicarTopeAmpliacion(e.total, materia.notaMinima, intentosEst);
      const totalAjustado = resultado.notaFinal;

      sumaTotal += totalAjustado;
      if (totalAjustado >= 90) distribucion.excelente++;
      else if (totalAjustado >= materia.notaMinima) distribucion.aprobado++;
      else distribucion.reprobado++;

      if (totalAjustado < materia.notaMinima) {
        enRiesgo.push({
          id: e.id,
          nombre: e.nombre,
          total: totalAjustado,
          totalOriginal: e.total,
          ampliacion: resultado.ampliacion,
          intentosRestantes: Math.max(0, 2 - (intentosEst ? intentosEst.length : 0))
        });
      }
    });
    enRiesgo.sort((a, b) => a.total - b.total);

    const totalEst = cuadro.lista.length;
    const promedio = totalEst > 0 ? parseFloat((sumaTotal / totalEst).toFixed(1)) : 0;

    // 2. Avance de calificacion por rubro (cuantos indicadores de cada categoria ya tienen al menos 1 nota)
    const dataInd = ss.getSheetByName("INDICADORES").getDataRange().getValues();
    const dataNotas = ss.getSheetByName("NOTAS").getDataRange().getValues();
    const indConNota = new Set();
    for (let i = 1; i < dataNotas.length; i++) indConNota.add(String(dataNotas[i][1]).trim());

    const CAT_LABEL = { TRAB_COT: 'Cotidiano', TAREAS: 'Tareas', PRUEBAS: 'Pruebas', PROYECTOS: 'Proyectos' };
    const avancePorRubro = {};
    Object.keys(CAT_LABEL).forEach(c => avancePorRubro[c] = { label: CAT_LABEL[c], total: 0, calificados: 0 });

    for (let i = 1; i < dataInd.length; i++) {
      if (String(dataInd[i][1]).trim() !== String(idMateria).trim()) continue;
      const cat = String(dataInd[i][2]).trim();
      if (!avancePorRubro[cat]) continue;
      avancePorRubro[cat].total++;
      if (indConNota.has(String(dataInd[i][0]).trim())) avancePorRubro[cat].calificados++;
    }

    // 3. Asistencia promedio de la materia (mismo motor que Cuadro/Boleta/SEA)
    const mapAsist = calcularAsistenciaMap(idMateria, materia.asistencia);
    let sumaAsist = 0;
    cuadro.lista.forEach(e => {
      sumaAsist += (mapAsist[e.id] !== undefined ? mapAsist[e.id] : materia.asistencia);
    });
    const asistenciaPromedio = totalEst > 0 ? parseFloat((sumaAsist / totalEst).toFixed(1)) : materia.asistencia;

    return {
      success: true,
      materia: materia.nombre,
      notaMinima: materia.notaMinima,
      totalEstudiantes: totalEst,
      promedio: promedio,
      distribucion: distribucion,
      enRiesgo: enRiesgo,
      avancePorRubro: Object.values(avancePorRubro),
      asistenciaPromedio: asistenciaPromedio,
      valorAsistTotal: materia.asistencia
    };
  } catch (e) { return { error: e.toString() }; }
}

// ==========================================
// KPIs POR SECCIÓN (DASHBOARD)
// ==========================================
function getSectionKPIs(idSeccion) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const idSec = String(idSeccion).trim();

    // 1. Estudiantes de la sección → mapa id→nombre
    const dataEst = ss.getSheetByName("ESTUDIANTES").getDataRange().getValues();
    const estMap = {}; // id → nombre
    for(let i=1; i<dataEst.length; i++) {
      if(String(dataEst[i][1]).trim() === idSec)
        estMap[String(dataEst[i][0]).trim()] = String(dataEst[i][3]).trim();
    }
    const estIds = new Set(Object.keys(estMap));
    const totalEst = estIds.size;

    // 2. Materias de la sección → mapa id→nombre
    const dataMat = ss.getSheetByName("MATERIAS").getDataRange().getValues();
    const matMap = {}; // id → nombre
    for(let i=1; i<dataMat.length; i++) {
      if(String(dataMat[i][1]).trim() === idSec)
        matMap[String(dataMat[i][0]).trim()] = String(dataMat[i][2]).trim();
    }
    const matIds = new Set(Object.keys(matMap));

    // 3. Indicadores → mapa id→{desc, idMateria}
    const dataInd = ss.getSheetByName("INDICADORES").getDataRange().getValues();
    const indMap = {}; // id → {desc, idMateria}
    for(let i=1; i<dataInd.length; i++) {
      const idMat = String(dataInd[i][1]).trim();
      if(matIds.has(idMat))
        indMap[String(dataInd[i][0]).trim()] = { desc: String(dataInd[i][3]).trim(), idMateria: idMat };
    }
    const indIds = new Set(Object.keys(indMap));

    // 4. Notas
    const dataNotas = ss.getSheetByName("NOTAS").getDataRange().getValues();
    const indConNota = new Set();
    const acumEst = {}; // idEst → total %
    let sumaTotal = 0, countNotas = 0;

    for(let i=1; i<dataNotas.length; i++) {
      const idInd = String(dataNotas[i][1]).trim();
      const idEst = String(dataNotas[i][2]).trim();
      const porc  = parseFloat(dataNotas[i][3]);
      if(indIds.has(idInd) && estIds.has(idEst) && !isNaN(porc)) {
        indConNota.add(idInd);
        acumEst[idEst] = (acumEst[idEst] || 0) + porc;
        sumaTotal += porc;
        countNotas++;
      }
    }

    // Detalle: indicadores sin calificar
    const detallesIndSinCalificar = [];
    indIds.forEach(id => {
      if(!indConNota.has(id)) {
        const ind = indMap[id];
        detallesIndSinCalificar.push({ desc: ind.desc, materia: matMap[ind.idMateria] || '' });
      }
    });

    // Detalle: estudiantes bajo mínimo
    const detallesBajoMinimo = [];
    let estBajoMinimo = 0;
    Object.entries(acumEst).forEach(([idEst, total]) => {
      if(total < 65) {
        estBajoMinimo++;
        detallesBajoMinimo.push({ nombre: estMap[idEst] || idEst, total: parseFloat(total.toFixed(1)) });
      }
    });
    detallesBajoMinimo.sort((a,b) => a.total - b.total);

    const promedioSeccion = countNotas > 0 ? parseFloat((sumaTotal / countNotas).toFixed(1)) : 0;

    // 5. Ausencias injustificadas → conteo por estudiante
    const dataAsist = ss.getSheetByName("ASISTENCIA_DATA").getDataRange().getValues();
    const aiCount = {}; // idEst → cant AI
    for(let i=1; i<dataAsist.length; i++) {
      const idEst = String(dataAsist[i][2]).trim();
      if(estIds.has(idEst) && String(dataAsist[i][4]).trim() === 'AI')
        aiCount[idEst] = (aiCount[idEst] || 0) + 1;
    }
    const detallesEstConAI = Object.entries(aiCount)
      .map(([id, cant]) => ({ nombre: estMap[id] || id, cant }))
      .sort((a,b) => b.cant - a.cant);

    // 6. Bitácoras pendientes
    const dataBit = ss.getSheetByName("BITACORAS").getDataRange().getValues();
    const detallesBitPendientes = [];
    for(let i=1; i<dataBit.length; i++) {
      if(String(dataBit[i][1]).trim() === idSec && dataBit[i][9] === true) {
        detallesBitPendientes.push({
          desc: String(dataBit[i][6]).trim(),
          fecha: dataBit[i][5] ? formatearFecha(dataBit[i][5]) : ''
        });
      }
    }

    return {
      success: true,
      totalEst,
      indSinCalificar: detallesIndSinCalificar.length,
      estConAI: detallesEstConAI.length,
      bitPendientes: detallesBitPendientes.length,
      estBajoMinimo,
      promedioSeccion,
      detallesBajoMinimo,
      detallesIndSinCalificar,
      detallesEstConAI,
      detallesBitPendientes
    };
  } catch(e) {
    return { error: e.toString() };
  }
}

// ==========================================
// MANTENIMIENTO ÚNICO: DEDUPLICAR NOTAS
// Corregir manualmente desde el editor de Apps Script (Run -> limpiarDuplicadosNotas)
// Elimina filas duplicadas (mismo INDICADOR + ESTUDIANTE) dejando SOLO la más reciente,
// consistente con el criterio que ahora usan obtenerDatosEvaluacion / obtenerCuadroMateria / obtenerDatosReporteSEA.
// Reescribe la hoja completa de una sola vez (rápido) en vez de borrar fila por fila
// (deleteRow uno por uno es demasiado lento para miles de filas y puede exceder
// el límite de 6 minutos de ejecución de Apps Script).
// Hacer una copia del Sheets antes de correrlo.
// ==========================================
function limpiarDuplicadosNotas() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("NOTAS");
  const data = sheet.getDataRange().getValues();
  const header = data[0];

  let ultimaFilaPorClave = {};
  for (let i = 1; i < data.length; i++) {
    let clave = String(data[i][1]).trim() + "||" + String(data[i][2]).trim();
    ultimaFilaPorClave[clave] = i; // índice dentro de data; la última ocurrencia gana
  }

  let filasFinales = [header];
  for (let i = 1; i < data.length; i++) {
    let clave = String(data[i][1]).trim() + "||" + String(data[i][2]).trim();
    if (ultimaFilaPorClave[clave] === i) {
      filasFinales.push(data[i]);
    }
  }

  const eliminadas = data.length - filasFinales.length;

  sheet.clearContents();
  sheet.getRange(1, 1, filasFinales.length, header.length).setValues(filasFinales);

  Logger.log("Filas duplicadas eliminadas: " + eliminadas);
  return { success: true, eliminadas: eliminadas };
}

// ==========================================
// MOTOR V2: MIGRACION UNICA (INDICADORES SIN PERIODO)
// Los indicadores creados ANTES de agregar el campo PERIODO tienen esa columna
// vacia. Sin este backfill, el filtro "Ver periodo" y "Clonar a Periodo 2" no
// encuentran nada para esas materias, porque comparan contra un periodo
// especifico (1, 2...) y la fila vieja no coincide con ninguno.
// Se asume que todo indicador sin periodo pertenece al I Periodo (es lo que ya
// existia cuando el sistema todavia no distinguia periodos). Correr UNA vez,
// desde el editor de Apps Script (Run -> migrarIndicadoresAPeriodo1), antes de
// usar el filtro de periodo o el clonado por primera vez en un Sheets existente.
// ==========================================
function migrarIndicadoresAPeriodo1() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("INDICADORES");
  const data = sheet.getDataRange().getValues();

  let actualizados = 0;
  for (let i = 1; i < data.length; i++) {
    const periodoActual = data[i][7];
    if (periodoActual === "" || periodoActual === undefined || periodoActual === null) {
      sheet.getRange(i + 1, 8).setValue(1);
      actualizados++;
    }
  }

  Logger.log("Indicadores migrados a Periodo 1: " + actualizados);
  return { success: true, actualizados: actualizados };
}

// ==========================================
// MOTOR V2: MIGRACION UNICA
// Recalcula el %_OBTENIDO de todas las notas TRAB_COT existentes usando el
// peso vigente ACTUAL de su materia (Opcion B), y lo congela. Correr UNA vez,
// solo en este sandbox, despues de pegar el motor nuevo, para que las notas
// que ya existian (copiadas de produccion) queden comparables contra el motor viejo.
// Correr desde el editor de Apps Script (Run -> migrarNotasAMotorV2).
// ==========================================
function migrarNotasAMotorV2() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("NOTAS");
  const data = sheet.getDataRange().getValues();

  const dataInd = ss.getSheetByName("INDICADORES").getDataRange().getValues();
  let mapIndCat = {}, mapIndMateria = {}, mapIndPeriodo = {};
  for (let i = 1; i < dataInd.length; i++) {
    const idInd = String(dataInd[i][0]).trim();
    mapIndCat[idInd] = dataInd[i][2];
    mapIndMateria[idInd] = String(dataInd[i][1]).trim();
    mapIndPeriodo[idInd] = dataInd[i][7];
  }

  // cache: 1 sola vuelta por combinacion materia+periodo, no una por nota. Antes
  // se cacheaba solo por materia, lo que mezclaba el conteo de indicadores de
  // varios periodos y arruinaba el peso (ej. 4 indicadores de 2 periodos
  // distintos contados como si fueran del mismo rubro).
  const pesoPorMateriaPeriodo = {};
  let actualizadas = 0;

  for (let i = 1; i < data.length; i++) {
    const idInd = String(data[i][1]).trim();
    if (mapIndCat[idInd] !== 'TRAB_COT') continue;

    const idMateria = mapIndMateria[idInd];
    const periodo = mapIndPeriodo[idInd];
    const clave = idMateria + "|" + periodo;
    if (pesoPorMateriaPeriodo[clave] === undefined) {
      pesoPorMateriaPeriodo[clave] = calcularPesoCotidianoVigente(ss, idMateria, periodo);
    }
    const peso = pesoPorMateriaPeriodo[clave];

    const nivelRaw = parseFloat(data[i][5]);
    const nivel = isFinite(nivelRaw) ? nivelRaw : 0;
    const nuevoPorc = parseFloat(((nivel / 3) * peso).toFixed(2));

    data[i][3] = nuevoPorc;
    data[i][5] = nivel;
    actualizadas++;
  }

  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);

  Logger.log("Notas TRAB_COT migradas al motor V2: " + actualizadas);
  return { success: true, actualizadas: actualizadas };
}

// ==========================================
// MOTOR V2: NOTA FINAL ANUAL
// Promedio simple de Periodo 1 y Periodo 2 (confirmado con Nelson).
// Si el Periodo 2 todavia no tiene notas, se marca como "Pendiente" en vez
// de forzar un promedio con un lado en cero.
// ==========================================
function obtenerNotaFinalAnual(idMateria) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const dataMat = ss.getSheetByName("MATERIAS").getDataRange().getValues();
    let notaMinima = 65;
    for (let i = 1; i < dataMat.length; i++) {
      if (String(dataMat[i][0]).trim() === String(idMateria).trim()) { notaMinima = Number(dataMat[i][8]) || 65; break; }
    }
    const ampliaciones = obtenerAmpliacionesPorMateria(ss, idMateria);

    const p1 = obtenerCuadroMateria(idMateria, 1);
    if (p1.error) return p1;
    const p2 = obtenerCuadroMateria(idMateria, 2);

    const mapP2 = {};
    if (!p2.error) p2.lista.forEach(e => { mapP2[e.id] = e; });

    const lista = p1.lista.map(eP1 => {
      const eP2 = mapP2[eP1.id];
      const tieneP2 = eP2 !== undefined;
      const notaFinalBase = tieneP2 ? Math.round((eP1.total + eP2.total) / 2) : "Pendiente";
      const resultado = aplicarTopeAmpliacion(notaFinalBase, notaMinima, ampliaciones[eP1.id]);

      return {
        id: eP1.id,
        nombre: eP1.nombre,
        notaPeriodo1: eP1.total,
        notaPeriodo2: tieneP2 ? eP2.total : null,
        notaFinal: resultado.notaFinal,
        notaFinalOriginal: notaFinalBase,
        ampliacion: resultado.ampliacion
      };
    });

    return { success: true, materia: p1.materia, lista: lista };
  } catch (e) { return { error: e.toString() }; }
}

// ==========================================
// MOTOR V2: AMPLIACIÓN (EXAMEN EXTRAORDINARIO)
// Reglas confirmadas con Nelson:
// - Aplica solo si la nota final (base) no alcanza notaMinima de la materia.
// - Máximo 2 intentos por estudiante+materia.
// - La nota final ajustada = MAX(notaBase, intento1, intento2).
//   Si ese máximo alcanza notaMinima, la nota final se topa exactamente en
//   notaMinima (no en la nota real de la ampliación, que igual queda
//   registrada para trazabilidad). Si ninguno alcanza, se muestra ese
//   máximo tal cual (aunque siga reprobado, refleja la mejor nota real).
// - No se usa en el Informe SEA (confirmado, no aplica ahí).
// Hoja AMPLIACIONES se autocrea en el primer registro (mismo patrón que
// BITACORA_CAMBIOS) para no depender de que alguien la arme a mano en Sheets.
// ==========================================

function obtenerAmpliacionesPorMateria(ss, idMateria) {
  const sheet = ss.getSheetByName("AMPLIACIONES");
  const map = {}; // idEst -> [{intento, nota, fecha}]
  if (!sheet) return map;
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() !== String(idMateria).trim()) continue;
    const idEst = String(data[i][2]).trim();
    if (!map[idEst]) map[idEst] = [];
    map[idEst].push({ intento: data[i][3], nota: Number(data[i][4]) || 0, fecha: data[i][5] });
  }
  return map;
}

function aplicarTopeAmpliacion(notaBase, notaMinima, intentos) {
  if (notaBase === null || notaBase === undefined || notaBase === "Pendiente") {
    return { notaFinal: notaBase, ampliacion: null };
  }
  if (!intentos || intentos.length === 0 || notaBase >= notaMinima) {
    return { notaFinal: notaBase, ampliacion: null };
  }

  let mejor = notaBase;
  let mejorIntento = null;
  intentos.forEach(it => {
    if (it.nota > mejor) { mejor = it.nota; mejorIntento = it; }
  });

  if (!mejorIntento) return { notaFinal: notaBase, ampliacion: null }; // ningún intento superó la nota original

  if (mejor >= notaMinima) {
    return { notaFinal: notaMinima, ampliacion: { notaObtenida: mejor, intento: mejorIntento.intento, aprobo: true } };
  }
  return { notaFinal: mejor, ampliacion: { notaObtenida: mejor, intento: mejorIntento.intento, aprobo: false } };
}

function guardarAmpliacion(form) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName("AMPLIACIONES");
    if (!sheet) {
      sheet = ss.insertSheet("AMPLIACIONES");
      sheet.appendRow(["ID", "ID_MATERIA", "ID_EST", "INTENTO", "NOTA", "FECHA", "ID_USUARIO", "FECHA_REGISTRO"]);
    }

    const data = sheet.getDataRange().getValues();
    let intentosPrevios = 0;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]).trim() === String(form.idMateria).trim() && String(data[i][2]).trim() === String(form.idEst).trim()) {
        intentosPrevios++;
      }
    }
    if (intentosPrevios >= 2) {
      return { success: false, message: "Ya se registraron los 2 intentos permitidos de ampliación para este estudiante en esta materia." };
    }

    const idUsuario = obtenerIdUsuarioPorEmail(form.email);
    const intento = intentosPrevios + 1;
    sheet.appendRow([
      "AMP-" + Date.now(),
      form.idMateria,
      form.idEst,
      intento,
      Number(form.nota) || 0,
      form.fecha || new Date(),
      idUsuario,
      new Date() // FECHA_REGISTRO: timestamp real del guardado, no editable -- para medir cuanto tarda el docente en registrar la ampliacion despues del examen.
    ]);
    return { success: true, intento: intento };
  } catch (e) { return { success: false, message: e.toString() }; }
}

// Reporte imprimible de Ampliaciones por materia -- reutiliza obtenerNotaFinalAnual
// (misma fuente de verdad que la pantalla "Nota Final Anual") en vez de recalcular.
// soloConAmpliacion=true filtra solo estudiantes que efectivamente hicieron algun intento.
function generarPdfAmpliaciones(idMateria, soloConAmpliacion) {
  try {
    const datos = obtenerNotaFinalAnual(idMateria);
    if (datos.error) return { success: false, message: datos.error };

    let lista = datos.lista;
    if (soloConAmpliacion) lista = lista.filter(e => e.ampliacion);

    if (lista.length === 0) {
      return { success: false, message: "No hay estudiantes que cumplan con el filtro seleccionado." };
    }

    let filas = "";
    lista.forEach((e, idx) => {
      const tieneAmp = !!e.ampliacion;
      const detalle = tieneAmp
        ? `Intento ${e.ampliacion.intento}: ${e.ampliacion.notaObtenida}% (original ${e.notaFinalOriginal}%)`
        : "—";
      const color = e.notaFinal === "Pendiente" ? "#999" : (e.notaFinal >= 65 ? "green" : "red");
      filas += `
      <tr>
        <td style="border:1px solid #ddd; padding:5px; font-size:10px; text-align:center;">${idx + 1}</td>
        <td style="border:1px solid #ddd; padding:5px; font-size:10px;">${e.nombre}</td>
        <td style="border:1px solid #ddd; padding:5px; font-size:10px; text-align:center;">${e.notaPeriodo1}</td>
        <td style="border:1px solid #ddd; padding:5px; font-size:10px; text-align:center;">${e.notaPeriodo2 !== null ? e.notaPeriodo2 : '—'}</td>
        <td style="border:1px solid #ddd; padding:5px; font-size:10px; text-align:center; font-weight:bold; background-color:#f0f0f0; color:${color};">${e.notaFinal}</td>
        <td style="border:1px solid #ddd; padding:5px; font-size:10px;">${detalle}</td>
      </tr>`;
    });

    const subtitulo = soloConAmpliacion ? "Solo estudiantes con Ampliación" : "Todos los estudiantes";
    let html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
         <h3 style="text-align:center; color:#004E64; margin-bottom:5px;">REPORTE DE AMPLIACIONES</h3>
         <h4 style="text-align:center; margin-top:0; color:#555;">${datos.materia}</h4>
         <p style="text-align:center; font-size:11px; color:#888; margin-top:0;">${subtitulo}</p>

         <table style="width:100%; border-collapse:collapse; margin-top:20px;">
            <thead>
                <tr style="background-color:#004E64; color:white; font-size:11px;">
                   <th style="padding:5px;">#</th>
                   <th style="padding:5px; text-align:left;">ESTUDIANTE</th>
                   <th style="padding:5px;">I PERIODO</th>
                   <th style="padding:5px;">II PERIODO</th>
                   <th style="padding:5px;">FINAL</th>
                   <th style="padding:5px; text-align:left;">DETALLE AMPLIACIÓN</th>
                </tr>
            </thead>
            <tbody>${filas}</tbody>
         </table>
      </div>
    `;

    const blob = Utilities.newBlob(html, MimeType.HTML).getAs(MimeType.PDF);
    blob.setName(`Ampliaciones_${datos.materia}.pdf`);
    return { success: true, base64: Utilities.base64Encode(blob.getBytes()), nombre: blob.getName() };

  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// ==========================================
// ALERTAS TEMPRANAS
// Basado en el catalogo oficial del MEP (Guia de implementacion de la ruta de
// alerta temprana, UPRE 2024 + Catalogo Alertas Tempranas UPRE 2023). Solo se
// automatizan las 2 alertas de "Desempeño educativo" que se pueden calcular
// con datos que ya existen en el sistema, con el criterio EXACTO del catalogo:
//
// - "Ausentismo a lecciones por materia en secundaria": se ausenta a la mitad
//   (>=50%) de las lecciones de al menos una asignatura, EN LA SEMANA.
// - "Bajo rendimiento academico": nota menor a la minima en AL MENOS 3
//   materias, en el periodo vigente.
//
// Se suma ademas el conteo de "Escapadas" del mes (estado E en
// ASISTENCIA_DATA) como señal extra -- no es una alerta del catalogo MEP,
// pero ya existe el dato y Nelson pidio incluirla.
//
// El resto de las 81 alertas del catalogo (convivencia, salud, economico,
// familiar, cultural, riesgo social...) son de observacion humana directa y
// NO se intentan inferir aqui -- eso se registra a mano en Bitacora.
// ==========================================
// Nota: es un radar del momento actual (mismo criterio que el catalogo oficial
// MEP: "durante la semana"), no un histórico -- por eso no recibe un mes a
// elegir. Ausentismo siempre es de la semana en curso, Rendimiento del periodo
// vigente ahora, y Escapadas siempre del mes calendario actual.
function obtenerAlertasTempranas(idSeccion) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);

    const dataEst = ss.getSheetByName("ESTUDIANTES").getDataRange().getValues();
    const estudiantes = {}; // idEst -> nombre
    for (let i = 1; i < dataEst.length; i++) {
      if (String(dataEst[i][1]).trim() === String(idSeccion).trim()) {
        estudiantes[String(dataEst[i][0]).trim()] = String(dataEst[i][3]).trim();
      }
    }

    const dataMat = ss.getSheetByName("MATERIAS").getDataRange().getValues();
    const materias = [];
    for (let i = 1; i < dataMat.length; i++) {
      if (String(dataMat[i][1]).trim() === String(idSeccion).trim()) {
        materias.push({ id: String(dataMat[i][0]).trim(), nombre: dataMat[i][2], notaMinima: Number(dataMat[i][8]) || 65 });
      }
    }

    // Ventana movil de "los ultimos 7 dias" (hoy incluido), en vez de semana
    // calendario estricta (lunes-domingo). Con calendario estricto, una
    // ausencia de hace 4-5 dias "desaparecia" del radar en cuanto arrancaba
    // la semana siguiente -- la ventana movil evita ese hueco.
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    const inicioVentana = new Date(hoy); inicioVentana.setDate(hoy.getDate() - 6);
    const finVentanaSemana = hoy;

    // Mes calendario actual, para Escapadas
    const anioMes = hoy.getFullYear() + "-" + String(hoy.getMonth() + 1).padStart(2, "0");

    const alertasPorEstudiante = {};
    Object.keys(estudiantes).forEach(id => {
      alertasPorEstudiante[id] = { id, nombre: estudiantes[id], ausentismo: [], bajoRendimiento: [], escapadas: 0 };
    });

    const diasMap = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dataCfg = ss.getSheetByName("CONF_HORARIO").getDataRange().getValues();
    const dataAsis = ss.getSheetByName("ASISTENCIA_DATA").getDataRange().getValues();

    // 1. AUSENTISMO SEMANAL POR MATERIA (>=50% de lecciones de la materia, en los ultimos 7 dias)
    materias.forEach(mat => {
      let lecPorDia = {}; // 'YYYY-MM-DD' -> lecciones programadas ese dia
      for (let i = 1; i < dataCfg.length; i++) {
        if (String(dataCfg[i][2]).trim() !== mat.id) continue;
        const ini = new Date(dataCfg[i][3]);
        const fin = new Date(dataCfg[i][4]);
        const dias = JSON.parse(dataCfg[i][5]);
        let cur = new Date(Math.max(ini.getTime(), inicioVentana.getTime()));
        const finRecorte = new Date(Math.min(fin.getTime(), finVentanaSemana.getTime()));
        while (cur <= finRecorte) {
          const dName = diasMap[cur.getDay()];
          if (dias[dName]) {
            const key = cur.toISOString().split('T')[0];
            lecPorDia[key] = (lecPorDia[key] || 0) + Number(dias[dName]);
          }
          cur.setDate(cur.getDate() + 1);
        }
      }
      const totalLecSemana = Object.values(lecPorDia).reduce((a, b) => a + b, 0);
      if (totalLecSemana === 0) return; // sin lecciones programadas esta semana para esta materia

      const perdidasPorEst = {};
      for (let i = 1; i < dataAsis.length; i++) {
        if (String(dataAsis[i][3]).trim() !== mat.id) continue;
        const estado = dataAsis[i][4];
        let peso = 0;
        if (estado === 'AI') peso = 1;
        else if (estado === 'T') peso = 0.5;
        if (peso === 0) continue;

        const fecha = new Date(dataAsis[i][1]);
        if (fecha < inicioVentana || fecha > finVentanaSemana) continue;

        const key = fecha.toISOString().split('T')[0];
        const lecDia = lecPorDia[key] || 0;
        if (lecDia === 0) continue;

        const idEst = String(dataAsis[i][2]).trim();
        perdidasPorEst[idEst] = (perdidasPorEst[idEst] || 0) + (lecDia * peso);
      }

      Object.keys(perdidasPorEst).forEach(idEst => {
        if (!alertasPorEstudiante[idEst]) return;
        const pct = perdidasPorEst[idEst] / totalLecSemana;
        if (pct >= 0.5) {
          alertasPorEstudiante[idEst].ausentismo.push({ materia: mat.nombre, pctPerdido: Math.round(pct * 100) });
        }
      });
    });

    // 2. BAJO RENDIMIENTO ACADEMICO (bajo la nota minima en >=3 materias, en el periodo vigente)
    materias.forEach(mat => {
      const periodo = determinarPeriodoVigente(ss, mat.id);
      const cuadro = obtenerCuadroMateria(mat.id, periodo);
      if (cuadro.error) return;
      cuadro.lista.forEach(e => {
        if (!alertasPorEstudiante[e.id]) return;
        if (e.total < mat.notaMinima) {
          alertasPorEstudiante[e.id].bajoRendimiento.push({ materia: mat.nombre, nota: e.total, notaMinima: mat.notaMinima });
        }
      });
    });

    // 3. ESCAPADAS DEL MES (señal extra, no es del catalogo MEP)
    for (let i = 1; i < dataAsis.length; i++) {
      if (dataAsis[i][4] !== 'E') continue;
      const idEst = String(dataAsis[i][2]).trim();
      if (!alertasPorEstudiante[idEst]) continue;
      const fecha = new Date(dataAsis[i][1]);
      const key = fecha.getFullYear() + "-" + String(fecha.getMonth() + 1).padStart(2, "0");
      if (key === anioMes) alertasPorEstudiante[idEst].escapadas++;
    }

    const resultado = Object.values(alertasPorEstudiante)
      .map(e => ({
        id: e.id,
        nombre: e.nombre,
        ausentismo: e.ausentismo,
        bajoRendimiento: e.bajoRendimiento.length >= 3 ? e.bajoRendimiento : [],
        escapadas: e.escapadas
      }))
      .filter(e => e.ausentismo.length > 0 || e.bajoRendimiento.length > 0 || e.escapadas > 0);

    resultado.sort((a, b) => {
      const puntajeA = a.ausentismo.length + a.bajoRendimiento.length + (a.escapadas > 0 ? 1 : 0);
      const puntajeB = b.ausentismo.length + b.bajoRendimiento.length + (b.escapadas > 0 ? 1 : 0);
      return puntajeB - puntajeA;
    });

    return {
      success: true,
      mes: anioMes,
      semanaIni: inicioVentana.toISOString().split('T')[0],
      semanaFin: finVentanaSemana.toISOString().split('T')[0],
      alertas: resultado
    };
  } catch (e) { return { error: e.toString() }; }
}

// filtroEstado (opcional): si viene, la tabla de seguimiento solo muestra
// registros con ese Estado -- para que el PDF coincida con lo que el docente
// esta viendo en pantalla con el filtro de Estado.
function generarPdfAlertasTempranas(idSeccion, filtroEstado) {
  try {
    const datos = obtenerAlertasTempranas(idSeccion);
    if (datos.error) return { success: false, message: datos.error };

    const seguimiento = obtenerAlertasSeguimiento(idSeccion);
    let listaSeguimiento = (seguimiento && seguimiento.lista) || [];
    if (filtroEstado) listaSeguimiento = listaSeguimiento.filter(s => s.estado === filtroEstado);

    if (datos.alertas.length === 0 && listaSeguimiento.length === 0) {
      return { success: false, message: "No hay alertas detectadas ni seguimiento registrado para mostrar en el reporte." };
    }

    let filasDetectadas = "";
    datos.alertas.forEach((e, idx) => {
      const detalles = [];
      if (e.ausentismo.length > 0) {
        detalles.push("<b>Ausentismo semanal:</b> " + e.ausentismo.map(a => `${a.materia} (${a.pctPerdido}% perdido)`).join(", "));
      }
      if (e.bajoRendimiento.length > 0) {
        detalles.push("<b>Bajo rendimiento académico</b> (" + e.bajoRendimiento.length + " materias): " + e.bajoRendimiento.map(m => `${m.materia} (${m.nota}%, mín. ${m.notaMinima}%)`).join(", "));
      }
      if (e.escapadas > 0) {
        detalles.push(`<b>Escapadas este mes:</b> ${e.escapadas}`);
      }

      filasDetectadas += `
      <tr>
        <td style="border:1px solid #ddd; padding:6px; font-size:10px; text-align:center;">${idx + 1}</td>
        <td style="border:1px solid #ddd; padding:6px; font-size:10px;">${e.nombre}</td>
        <td style="border:1px solid #ddd; padding:6px; font-size:10px;">${detalles.join("<br>")}</td>
      </tr>`;
    });

    const tablaDetectadas = datos.alertas.length === 0
      ? `<p style="font-size:11px; color:#999; text-align:center;">Nadie tiene alertas detectadas automáticamente ahora mismo.</p>`
      : `<table style="width:100%; border-collapse:collapse; margin-top:10px;">
            <thead>
                <tr style="background-color:#004E64; color:white; font-size:11px;">
                   <th style="padding:6px;">#</th>
                   <th style="padding:6px; text-align:left;">ESTUDIANTE</th>
                   <th style="padding:6px; text-align:left;">ALERTAS DETECTADAS</th>
                </tr>
            </thead>
            <tbody>${filasDetectadas}</tbody>
         </table>`;

    let filasSeguimiento = "";
    listaSeguimiento.forEach((s, idx) => {
      const fecha = s.fecha ? Utilities.formatDate(new Date(s.fecha), Session.getScriptTimeZone(), "dd/MM/yyyy") : "";
      filasSeguimiento += `
      <tr>
        <td style="border:1px solid #ddd; padding:6px; font-size:10px; text-align:center;">${idx + 1}</td>
        <td style="border:1px solid #ddd; padding:6px; font-size:10px;">${s.nombreEst}</td>
        <td style="border:1px solid #ddd; padding:6px; font-size:10px;">${s.dimension}<br><span style="color:#888;">${s.nombreAlerta}</span></td>
        <td style="border:1px solid #ddd; padding:6px; font-size:10px; text-align:center;">${s.estado}</td>
        <td style="border:1px solid #ddd; padding:6px; font-size:10px;">${s.comentario || "—"}</td>
        <td style="border:1px solid #ddd; padding:6px; font-size:9px; text-align:center;">${fecha}</td>
      </tr>`;
    });

    const tablaSeguimiento = listaSeguimiento.length === 0
      ? `<p style="font-size:11px; color:#999; text-align:center;">No hay seguimiento registrado${filtroEstado ? ` con estado "${filtroEstado}"` : ""}.</p>`
      : `<table style="width:100%; border-collapse:collapse; margin-top:10px;">
            <thead>
                <tr style="background-color:#0d9488; color:white; font-size:11px;">
                   <th style="padding:6px;">#</th>
                   <th style="padding:6px; text-align:left;">ESTUDIANTE</th>
                   <th style="padding:6px; text-align:left;">ALERTA (CATÁLOGO MEP)</th>
                   <th style="padding:6px;">ESTADO</th>
                   <th style="padding:6px; text-align:left;">COMENTARIO</th>
                   <th style="padding:6px;">ÚLT. ACTUALIZACIÓN</th>
                </tr>
            </thead>
            <tbody>${filasSeguimiento}</tbody>
         </table>`;

    let html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
         <h3 style="text-align:center; color:#004E64; margin-bottom:5px;">REPORTE MENSUAL DE ALERTAS TEMPRANAS</h3>
         <p style="text-align:center; font-size:11px; color:#888; margin-top:0;">Mes de referencia: ${datos.mes} · Ausentismo evaluado sobre los últimos 7 días: ${datos.semanaIni} al ${datos.semanaFin}${filtroEstado ? ` · Seguimiento filtrado por estado: <b>${filtroEstado}</b>` : ""}</p>
         <p style="font-size:10px; color:#999; text-align:center;">Basado en el Catálogo Oficial de Alertas Tempranas (UPRE-MEP). "Escapadas" es una señal adicional del sistema, no forma parte del catálogo oficial.</p>

         <h4 style="color:#004E64; margin-bottom:0;">Detección automática</h4>
         ${tablaDetectadas}

         <h4 style="color:#0d9488; margin-top:24px; margin-bottom:0;">Seguimiento registrado</h4>
         ${tablaSeguimiento}
      </div>
    `;

    const blob = Utilities.newBlob(html, MimeType.HTML).getAs(MimeType.PDF);
    blob.setName(`Alertas_Tempranas_${datos.mes}.pdf`);
    return { success: true, base64: Utilities.base64Encode(blob.getBytes()), nombre: blob.getName() };

  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// ==========================================
// SEGUIMIENTO DE ALERTAS TEMPRANAS (Fase 2)
// Registro persistente de una alerta detectada (o reportada a mano), con la
// Dimension + Nombre de Alerta del Catalogo Oficial UPRE-MEP y el Estado
// oficial (Activada/En proceso/En espera/Cerrada/Eliminada). A diferencia de
// obtenerAlertasTempranas (que es un calculo en vivo, no guarda nada), esto es
// lo que le permite al docente decir "ya estoy atendiendo esto" y llevar el
// registro que despues tiene que trasladar a su Boleta de AT / plataforma SABER.
// Hoja ALERTAS_TEMPRANAS_SEGUIMIENTO se autocrea en el primer registro (mismo
// patron que AMPLIACIONES y BITACORA_CAMBIOS).
// ==========================================
function guardarAlertaTemprana(form) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName("ALERTAS_TEMPRANAS_SEGUIMIENTO");
    if (!sheet) {
      sheet = ss.insertSheet("ALERTAS_TEMPRANAS_SEGUIMIENTO");
      sheet.appendRow(["ID", "ID_SECCION", "ID_EST", "DIMENSION", "NOMBRE_ALERTA", "CONTEXTO", "PRIORIDAD", "ESTADO", "COMENTARIO", "FECHA", "ID_USUARIO"]);
    }

    const idUsuario = obtenerIdUsuarioPorEmail(form.email);

    if (form.idAlerta) {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(form.idAlerta)) {
          const fila = i + 1;
          // Antes solo se guardaban estado/comentario -- si el docente cambiaba
          // la Dimension o el Nombre de la Alerta en el modal de edicion, ese
          // cambio se perdia en silencio. Ahora se actualizan todos los campos.
          sheet.getRange(fila, 4).setValue(form.dimension || data[i][3]);
          sheet.getRange(fila, 5).setValue(form.nombreAlerta || data[i][4]);
          sheet.getRange(fila, 6).setValue(form.contexto !== undefined ? form.contexto : data[i][5]);
          sheet.getRange(fila, 7).setValue(form.prioridad !== undefined ? form.prioridad : data[i][6]);
          sheet.getRange(fila, 8).setValue(form.estado || data[i][7]);
          sheet.getRange(fila, 9).setValue(form.comentario !== undefined ? form.comentario : data[i][8]);
          sheet.getRange(fila, 10).setValue(new Date());

          // Cualquier edicion tambien queda como entrada de la bitacora de
          // seguimiento, para que el historial completo viva en un solo lugar
          // sin importar si se uso "Editar" o "Agregar seguimiento".
          registrarLogAlerta(ss, form.idAlerta, form.estado || data[i][7], form.comentario !== undefined ? form.comentario : data[i][8], idUsuario);

          return { success: true, message: "Alerta actualizada" };
        }
      }
      return { success: false, message: "Alerta no encontrada" };
    }

    const idNuevo = "AT-" + Date.now();
    const estadoInicial = form.estado || "Activada";
    sheet.appendRow([
      idNuevo,
      form.idSeccion,
      form.idEst,
      form.dimension,
      form.nombreAlerta,
      form.contexto || "",
      form.prioridad || "",
      estadoInicial,
      form.comentario || "",
      new Date(),
      idUsuario
    ]);

    // El comentario de creacion es la primera entrada de la bitacora de
    // seguimiento -- asi toda la historia (por que se abrio, que paso despues)
    // vive en un solo lugar (ver registrarLogAlerta / obtenerSeguimientoAlerta).
    registrarLogAlerta(ss, idNuevo, estadoInicial, form.comentario || "", idUsuario);

    return { success: true, message: "Alerta registrada" };
  } catch (e) { return { success: false, message: e.toString() }; }
}

// ==========================================
// BITÁCORA DE SEGUIMIENTO POR ALERTA (Fase 3)
// El Comentario/Estado del registro principal solo mostraba el ULTIMO valor
// -- cada edicion pisaba lo anterior, sin dejar rastro de que paso semana a
// semana. Esto agrega una bitacora propia por alerta: cada entrada nueva se
// SUMA (no reemplaza), y la ultima entrada define el Estado vigente de la
// alerta principal. El "Comentario" del registro principal se deja intacto
// como el motivo original de apertura -- el detalle de seguimiento vive acá.
// ==========================================
function registrarLogAlerta(ss, idAlerta, estado, nota, idUsuario) {
  let sheet = ss.getSheetByName("ALERTAS_TEMPRANAS_LOG");
  if (!sheet) {
    sheet = ss.insertSheet("ALERTAS_TEMPRANAS_LOG");
    sheet.appendRow(["ID", "ID_ALERTA", "FECHA", "ESTADO", "NOTA", "ID_USUARIO"]);
  }
  sheet.appendRow(["LOG-" + Date.now() + Math.floor(Math.random() * 1000), idAlerta, new Date(), estado, nota, idUsuario]);
}

// MIGRACION UNICA: alertas creadas ANTES de que existiera la bitacora de
// seguimiento (ALERTAS_TEMPRANAS_LOG) nunca tuvieron esa primera entrada de
// "Activada" con el motivo de apertura -- su PDF de seguimiento sale con la
// linea de tiempo vacia o incompleta. Rellena esa entrada faltante usando el
// Estado/Comentario/Fecha que ya tenia el registro principal. Correr UNA vez,
// desde el editor de Apps Script (Run -> migrarAlertasSinLogInicial).
function migrarAlertasSinLogInicial() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheetPadre = ss.getSheetByName("ALERTAS_TEMPRANAS_SEGUIMIENTO");
  if (!sheetPadre) return { success: true, actualizadas: 0 };

  let sheetLog = ss.getSheetByName("ALERTAS_TEMPRANAS_LOG");
  if (!sheetLog) {
    sheetLog = ss.insertSheet("ALERTAS_TEMPRANAS_LOG");
    sheetLog.appendRow(["ID", "ID_ALERTA", "FECHA", "ESTADO", "NOTA", "ID_USUARIO"]);
  }

  const dataLog = sheetLog.getDataRange().getValues();
  const idsConLog = new Set();
  for (let i = 1; i < dataLog.length; i++) idsConLog.add(String(dataLog[i][1]).trim());

  const dataPadre = sheetPadre.getDataRange().getValues();
  let actualizadas = 0;
  for (let i = 1; i < dataPadre.length; i++) {
    const idAlerta = String(dataPadre[i][0]).trim();
    if (idsConLog.has(idAlerta)) continue; // ya tiene bitacora, no hace falta

    sheetLog.appendRow([
      "LOG-" + Date.now() + Math.floor(Math.random() * 1000),
      idAlerta,
      dataPadre[i][9] || new Date(), // FECHA original del registro principal
      dataPadre[i][7],               // ESTADO que tenia en ese momento
      dataPadre[i][8],                // COMENTARIO original (motivo de apertura)
      dataPadre[i][10]
    ]);
    actualizadas++;
  }

  Logger.log("Alertas con bitacora inicial rellenada: " + actualizadas);
  return { success: true, actualizadas: actualizadas };
}

function guardarSeguimientoAlerta(form) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const idUsuario = obtenerIdUsuarioPorEmail(form.email);

    registrarLogAlerta(ss, form.idAlerta, form.estado, form.nota || "", idUsuario);

    // Sincroniza el Estado vigente en el registro principal, para que la
    // tabla de "en riesgo" y el badge de la fila reflejen la ultima entrada.
    const sheet = ss.getSheetByName("ALERTAS_TEMPRANAS_SEGUIMIENTO");
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(form.idAlerta)) {
          sheet.getRange(i + 1, 8).setValue(form.estado);
          sheet.getRange(i + 1, 10).setValue(new Date());
          break;
        }
      }
    }

    return { success: true, message: "Seguimiento agregado" };
  } catch (e) { return { success: false, message: e.toString() }; }
}

function obtenerSeguimientoAlerta(idAlerta) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName("ALERTAS_TEMPRANAS_LOG");
    if (!sheet) return { success: true, lista: [] };

    const data = sheet.getDataRange().getValues();
    const lista = [];
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]).trim() !== String(idAlerta).trim()) continue;
      lista.push({ fecha: data[i][2], estado: data[i][3], nota: data[i][4] });
    }
    lista.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // cronologico, mas viejo primero
    return { success: true, lista: lista };
  } catch (e) { return { error: e.toString() }; }
}

function obtenerAlertasSeguimiento(idSeccion) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName("ALERTAS_TEMPRANAS_SEGUIMIENTO");
    if (!sheet) return { success: true, lista: [] };

    const dataEst = ss.getSheetByName("ESTUDIANTES").getDataRange().getValues();
    const nombresPorId = {};
    for (let i = 1; i < dataEst.length; i++) nombresPorId[String(dataEst[i][0]).trim()] = String(dataEst[i][3]).trim();

    const data = sheet.getDataRange().getValues();
    const lista = [];
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]).trim() !== String(idSeccion).trim()) continue;
      const idEst = String(data[i][2]).trim();
      lista.push({
        idAlerta: data[i][0],
        idEst: idEst,
        nombreEst: nombresPorId[idEst] || idEst,
        dimension: data[i][3],
        nombreAlerta: data[i][4],
        contexto: data[i][5],
        prioridad: data[i][6],
        estado: data[i][7],
        comentario: data[i][8],
        fecha: data[i][9]
      });
    }
    lista.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    return { success: true, lista: lista };
  } catch (e) { return { error: e.toString() }; }
}

// Borrado real de un registro (ej. se eligio el estudiante equivocado, o se
// registro por error). Distinto del estado oficial "Eliminada" del catalogo
// MEP -- ese es un estado mas (se conserva el registro para auditoria), esto
// borra la fila por completo.
function eliminarAlertaTemprana(idAlerta) {
  return eliminarFilaGenerico("ALERTAS_TEMPRANAS_SEGUIMIENTO", idAlerta);
}

function obtenerAlertaPorId(idAlerta) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("ALERTAS_TEMPRANAS_SEGUIMIENTO");
  if (!sheet) return null;

  const dataEst = ss.getSheetByName("ESTUDIANTES").getDataRange().getValues();
  const nombresPorId = {};
  for (let i = 1; i < dataEst.length; i++) nombresPorId[String(dataEst[i][0]).trim()] = String(dataEst[i][3]).trim();

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(idAlerta).trim()) {
      const idEst = String(data[i][2]).trim();
      return {
        idAlerta: data[i][0], idEst: idEst, nombreEst: nombresPorId[idEst] || idEst,
        dimension: data[i][3], nombreAlerta: data[i][4], contexto: data[i][5],
        prioridad: data[i][6], estado: data[i][7], comentario: data[i][8], fecha: data[i][9]
      };
    }
  }
  return null;
}

// PDF individual de UNA alerta, con toda su bitacora de seguimiento -- desde
// que se registro (Activada) hasta el estado actual (ej. Cerrada). Distinto
// del reporte mensual (que junta TODAS las alertas de la seccion); este es
// para respaldar un caso puntual, ej. para adjuntar a la Boleta de AT oficial.
function generarPdfSeguimientoAlerta(idAlerta, email) {
  try {
    const alerta = obtenerAlertaPorId(idAlerta);
    if (!alerta) return { success: false, message: "Alerta no encontrada" };

    // Nombre del docente que genera el documento, para el bloque de firma
    let nombreDocente = "Docente a cargo";
    if (email) {
      const idUsuario = obtenerIdUsuarioPorEmail(email);
      if (idUsuario) {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const dataUsers = ss.getSheetByName("USUARIOS").getDataRange().getValues();
        for (let j = 1; j < dataUsers.length; j++) {
          if (String(dataUsers[j][0]) === String(idUsuario)) { nombreDocente = dataUsers[j][1]; break; }
        }
      }
    }

    const seguimiento = obtenerSeguimientoAlerta(idAlerta);
    const entradas = (seguimiento && seguimiento.lista) || [];

    let filasLog = "";
    if (entradas.length === 0) {
      filasLog = `<tr><td colspan="3" style="padding:10px; text-align:center; color:#999; font-size:11px;">Sin entradas de seguimiento todavía.</td></tr>`;
    } else {
      entradas.forEach(en => {
        // Fecha y hora exactas de cada entrada (antes solo se mostraba la fecha)
        const fecha = en.fecha ? Utilities.formatDate(new Date(en.fecha), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm") : "";
        filasLog += `
        <tr>
          <td style="border:1px solid #ddd; padding:6px; font-size:10px; text-align:center; white-space:nowrap;">${fecha}</td>
          <td style="border:1px solid #ddd; padding:6px; font-size:10px; text-align:center;">${en.estado}</td>
          <td style="border:1px solid #ddd; padding:6px; font-size:10px;">${en.nota || "—"}</td>
        </tr>`;
      });
    }

    const fechaEmision = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
         <h3 style="text-align:center; color:#004E64; margin-bottom:5px;">SEGUIMIENTO DE ALERTA TEMPRANA</h3>
         <p style="text-align:center; font-size:11px; color:#888; margin-top:0;">Catálogo Oficial de Alertas Tempranas (UPRE-MEP)</p>

         <table style="width:100%; margin-top:15px; font-size:11px;">
            <tr><td style="padding:3px 0; color:#666;">Estudiante:</td><td style="padding:3px 0;"><b>${alerta.nombreEst}</b></td></tr>
            <tr><td style="padding:3px 0; color:#666;">Dimensión:</td><td style="padding:3px 0;">${alerta.dimension}</td></tr>
            <tr><td style="padding:3px 0; color:#666;">Nombre de la Alerta:</td><td style="padding:3px 0;">${alerta.nombreAlerta}</td></tr>
            <tr><td style="padding:3px 0; color:#666;">Contexto:</td><td style="padding:3px 0;">${alerta.contexto || "—"}</td></tr>
            <tr><td style="padding:3px 0; color:#666;">Prioridad:</td><td style="padding:3px 0;">${alerta.prioridad || "—"}</td></tr>
            <tr><td style="padding:3px 0; color:#666;">Estado actual:</td><td style="padding:3px 0;"><b>${alerta.estado}</b></td></tr>
            <tr><td style="padding:3px 0; color:#666;">Motivo de apertura:</td><td style="padding:3px 0;">${alerta.comentario || "—"}</td></tr>
         </table>

         <h4 style="color:#0d9488; margin-top:20px; margin-bottom:5px;">Línea de Tiempo del Seguimiento</h4>
         <table style="width:100%; border-collapse:collapse;">
            <thead>
                <tr style="background-color:#0d9488; color:white; font-size:11px;">
                   <th style="padding:6px;">FECHA Y HORA</th>
                   <th style="padding:6px;">ESTADO</th>
                   <th style="padding:6px; text-align:left;">NOTA DE SEGUIMIENTO</th>
                </tr>
            </thead>
            <tbody>${filasLog}</tbody>
         </table>

         <table style="width:100%; margin-top:60px; font-size:10px;">
            <tr>
               <td style="width:50%; padding-right:20px; vertical-align:top;">
                  <p style="border-top:1px solid #333; padding-top:4px; margin:0;">Firma del Docente: ${nombreDocente}</p>
               </td>
               <td style="width:50%; padding-left:20px; vertical-align:top;">
                  <p style="border-top:1px solid #333; padding-top:4px; margin:0;">Firma de Padre/Encargado(a) u Oficina de Atención al Estudiante</p>
               </td>
            </tr>
            <tr>
               <td style="padding-right:20px; padding-top:30px; vertical-align:top;">
                  <p style="border-top:1px solid #333; padding-top:4px; margin:0;">Cédula: _____________________ &nbsp; Fecha: _____________</p>
               </td>
               <td style="padding-left:20px; padding-top:30px; vertical-align:top;">
                  <p style="border-top:1px solid #333; padding-top:4px; margin:0;">Nombre: _____________________ &nbsp; Cédula: _____________</p>
               </td>
            </tr>
         </table>
         <p style="font-size:9px; color:#999; text-align:center; margin-top:30px;">Documento emitido por RegistraME V-Pro el ${fechaEmision}. Sirve como respaldo del seguimiento de esta Alerta Temprana, oficial UPRE-MEP.</p>
      </div>
    `;

    const blob = Utilities.newBlob(html, MimeType.HTML).getAs(MimeType.PDF);
    blob.setName(`Seguimiento_${alerta.nombreEst.replace(/\s+/g, "_")}.pdf`);
    return { success: true, base64: Utilities.base64Encode(blob.getBytes()), nombre: blob.getName() };

  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// ==========================================
// EXIMICIÓN (Articulo 49 del Reglamento de Evaluacion de los Aprendizajes y
// de la Conducta, Decreto 45509-MEP, vigente desde 2026)
//
// NO es "eximir de la materia" -- es eximirse SOLO de la ultima prueba del
// ultimo periodo, y unicamente en materias con al menos 2 Pruebas en ese
// periodo. Requisito: nota >=90 en el I Periodo Y >=90 en CADA componente
// (Cotidiano/Tareas/Pruebas/Proyectos con peso asignado) del ultimo periodo.
//
// OJO: esto es un concepto totalmente distinto del campo "eximido" que ya
// existe en ESTUDIANTES (ese solo controla si recibe correos a la casa) --
// no se reutiliza esa columna para nada de esto.
// ==========================================
function obtenerElegiblesEximicion(idMateria) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);

    const dataMat = ss.getSheetByName("MATERIAS").getDataRange().getValues();
    let materia = null;
    for (let i = 1; i < dataMat.length; i++) {
      if (String(dataMat[i][0]).trim() === String(idMateria).trim()) {
        materia = {
          id: dataMat[i][0], idSec: dataMat[i][1], nombre: dataMat[i][2],
          cotidiano: Number(dataMat[i][3]) || 0,
          tareas: Number(dataMat[i][4]) || 0,
          pruebas: Number(dataMat[i][5]) || 0,
          proyectos: Number(dataMat[i][6]) || 0
        };
        break;
      }
    }
    if (!materia) return { error: "Materia no encontrada" };

    const dataSec = ss.getSheetByName("SECCIONES").getDataRange().getValues();
    let ultimoPeriodo = 1;
    for (let i = 1; i < dataSec.length; i++) {
      if (String(dataSec[i][0]).trim() === String(materia.idSec).trim()) {
        ultimoPeriodo = Number(dataSec[i][4]) || 1;
        break;
      }
    }
    if (ultimoPeriodo < 2) {
      return { error: "Esta sección tiene un solo periodo (Anual). El Artículo 49 compara contra el I Periodo, así que no aplica en un esquema de 1 solo periodo." };
    }

    const dataInd = ss.getSheetByName("INDICADORES").getDataRange().getValues();
    const pruebasUltimoPeriodo = [];
    for (let i = 1; i < dataInd.length; i++) {
      if (String(dataInd[i][1]).trim() === String(idMateria).trim()
          && String(dataInd[i][2]).trim() === "PRUEBAS"
          && String(dataInd[i][7]) === String(ultimoPeriodo)) {
        pruebasUltimoPeriodo.push({ id: String(dataInd[i][0]).trim(), descripcion: dataInd[i][3], fechaCreacion: new Date(dataInd[i][5]) });
      }
    }

    if (pruebasUltimoPeriodo.length < 2) {
      return { error: "Esta materia no tiene al menos 2 indicadores de Pruebas en el último periodo -- el Artículo 49 exige mínimo 2 pruebas por periodo para poder aplicar." };
    }

    // La "ultima prueba" se sugiere como la creada mas recientemente, pero el
    // docente puede elegir otra desde el frontend (por eso se devuelven todas).
    pruebasUltimoPeriodo.sort((a, b) => b.fechaCreacion - a.fechaCreacion);
    const ultimaPruebaSugerida = pruebasUltimoPeriodo[0];

    const cuadroP1 = obtenerCuadroMateria(idMateria, 1);
    const cuadroUltimo = obtenerCuadroMateria(idMateria, ultimoPeriodo);
    if (cuadroP1.error) return { error: "No se pudo calcular el I Periodo: " + cuadroP1.error };
    if (cuadroUltimo.error) return { error: "No se pudo calcular el último periodo: " + cuadroUltimo.error };

    const mapP1 = {};
    cuadroP1.lista.forEach(e => { mapP1[e.id] = e.total; });

    // Solo se evaluan los componentes que la materia realmente usa (peso > 0)
    const componentes = [
      { key: 'TRAB_COT', label: 'Cotidiano', peso: materia.cotidiano },
      { key: 'TAREAS', label: 'Tareas', peso: materia.tareas },
      { key: 'PRUEBAS', label: 'Pruebas', peso: materia.pruebas },
      { key: 'PROYECTOS', label: 'Proyectos', peso: materia.proyectos }
    ].filter(c => c.peso > 0);

    const elegibles = [];
    cuadroUltimo.lista.forEach(e => {
      const notaP1 = mapP1[e.id];
      if (notaP1 === undefined || notaP1 < 90) return;

      let cumpleTodos = true;
      const detalleComponentes = componentes.map(c => {
        const obtenido = e.notas[c.key] || 0;
        const pct = Math.round((obtenido / c.peso) * 1000) / 10; // 1 decimal
        if (pct < 90) cumpleTodos = false;
        return { categoria: c.label, porcentaje: pct };
      });

      if (cumpleTodos) {
        elegibles.push({ id: e.id, nombre: e.nombre, notaPeriodo1: notaP1, componentes: detalleComponentes });
      }
    });

    return {
      success: true,
      materia: materia.nombre,
      ultimoPeriodo: ultimoPeriodo,
      pruebasDisponibles: pruebasUltimoPeriodo.map(p => ({ id: p.id, descripcion: p.descripcion })),
      ultimaPruebaSugerida: { id: ultimaPruebaSugerida.id, descripcion: ultimaPruebaSugerida.descripcion },
      elegibles: elegibles
    };
  } catch (e) { return { error: e.toString() }; }
}

function aplicarEximicion(form) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);

    // Dias habiles (lunes a viernes) entre la fecha de aviso y la fecha de la prueba
    const fechaAviso = new Date(form.fechaAviso);
    const fechaPrueba = new Date(form.fechaPrueba);
    let diasHabiles = 0;
    let cur = new Date(fechaAviso);
    while (cur < fechaPrueba) {
      cur.setDate(cur.getDate() + 1);
      const dia = cur.getDay();
      if (dia !== 0 && dia !== 6) diasHabiles++;
    }
    const avisoValido = diasHabiles >= 5;

    // Puntos totales del indicador, para poner nivel = maximo (nota completa,
    // el Articulo 49 exige consignar 100 en la prueba respectiva)
    const dataInd = ss.getSheetByName("INDICADORES").getDataRange().getValues();
    let puntosTotalesInd = 100;
    let existeIndicador = false;
    for (let i = 1; i < dataInd.length; i++) {
      if (String(dataInd[i][0]).trim() === String(form.idIndicadorPrueba).trim()) {
        puntosTotalesInd = parseFloat(dataInd[i][6]) || 100;
        existeIndicador = true;
        break;
      }
    }
    if (!existeIndicador) return { success: false, message: "El indicador de la prueba no existe" };

    // Reutiliza el motor real de calificacion (misma logica de porcentaje y
    // misma bitacora de cambios que una nota normal) en vez de escribir la
    // hoja NOTAS a mano por separado.
    guardarCalificaciones({
      idIndicador: form.idIndicadorPrueba,
      lista: [{ idEst: form.idEst, nivel: puntosTotalesInd }],
      email: form.email
    });

    // Registro de trazabilidad de la exencion (para poder demostrar que se
    // avisco con la antelacion que exige el Articulo 49)
    let sheet = ss.getSheetByName("EXIMICIONES");
    if (!sheet) {
      sheet = ss.insertSheet("EXIMICIONES");
      sheet.appendRow(["ID", "ID_MATERIA", "ID_EST", "ID_INDICADOR_PRUEBA", "FECHA_AVISO", "FECHA_PRUEBA", "AVISO_VALIDO", "ID_USUARIO", "FECHA_REGISTRO"]);
    }
    const idUsuario = obtenerIdUsuarioPorEmail(form.email);
    sheet.appendRow([
      "EXIM-" + Date.now(),
      form.idMateria,
      form.idEst,
      form.idIndicadorPrueba,
      form.fechaAviso,
      form.fechaPrueba,
      avisoValido,
      idUsuario,
      new Date()
    ]);

    return { success: true, avisoValido: avisoValido, diasHabiles: diasHabiles };
  } catch (e) { return { success: false, message: e.toString() }; }
}

function obtenerHistorialEximiciones(idMateria) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName("EXIMICIONES");
    if (!sheet) return { success: true, lista: [] };

    const dataEst = ss.getSheetByName("ESTUDIANTES").getDataRange().getValues();
    const nombresPorId = {};
    for (let i = 1; i < dataEst.length; i++) nombresPorId[String(dataEst[i][0]).trim()] = String(dataEst[i][3]).trim();

    const dataInd = ss.getSheetByName("INDICADORES").getDataRange().getValues();
    const descPorIndicador = {};
    for (let i = 1; i < dataInd.length; i++) descPorIndicador[String(dataInd[i][0]).trim()] = dataInd[i][3];

    const data = sheet.getDataRange().getValues();
    const lista = [];
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]).trim() !== String(idMateria).trim()) continue;
      const idEst = String(data[i][2]).trim();
      const idInd = String(data[i][3]).trim();
      lista.push({
        idEst: idEst,
        nombreEst: nombresPorId[idEst] || idEst,
        descripcionPrueba: descPorIndicador[idInd] || idInd,
        fechaAviso: data[i][4],
        fechaPrueba: data[i][5],
        avisoValido: data[i][6],
        fechaRegistro: data[i][8]
      });
    }
    lista.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));
    return { success: true, lista: lista };
  } catch (e) { return { error: e.toString() }; }
}
