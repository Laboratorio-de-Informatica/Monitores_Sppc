import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import { format } from "date-fns"

// Función para generar PDF
export async function generatePdf(title: string, period: string, attendances: any[], stats: any) {
  // Crear documento PDF
  const doc = new jsPDF()

  // Título
  doc.setFontSize(18)
  doc.text(title, 14, 20)

  // Período
  doc.setFontSize(12)
  doc.text(period, 14, 30)

  // Estadísticas
  doc.setFontSize(14)
  doc.text("Estadísticas", 14, 45)

  doc.setFontSize(10)
  doc.text(`Total de estudiantes atendidos: ${stats.totalStudents}`, 14, 55)
  doc.text(`Total de atenciones: ${stats.totalAttendances}`, 14, 62)
  doc.text(`Promedio diario de atenciones: ${stats.averageAttendancesPerDay.toFixed(1)}`, 14, 69)

  const hours = Math.floor(stats.totalSessionTime / 60)
  const minutes = stats.totalSessionTime % 60
  doc.text(`Tiempo total de sesión: ${hours}h ${minutes}m`, 14, 76)

  // Materias
  doc.setFontSize(14)
  doc.text("Materias Atendidas", 14, 90)

  const subjectsData = stats.subjectStats.map((subject: any, index: number) => [index + 1, subject.name, subject.count])

  // Usar autoTable como función sobre doc
  autoTable(doc, {
    startY: 95,
    head: [["#", "Materia", "Cantidad"]],
    body: subjectsData,
  })

  // Lista de atenciones
  doc.addPage()
  doc.setFontSize(14)
  doc.text("Lista de Atenciones", 14, 20)

  const attendancesData = attendances.map((attendance, index) => [
    index + 1,
    attendance.person_name,
    attendance.person_id,
    attendance.subject,
    format(new Date(attendance.created_at), "dd/MM/yyyy HH:mm"),
  ])

  // @ts-ignore
  autoTable(doc, {
    startY: 25,
    head: [["#", "Nombre", "ID", "Materia", "Fecha y Hora"]],
    body: attendancesData,
  })

  // Guardar PDF
  doc.save(`${title.replace(/\s+/g, "_")}.pdf`)
}

// Función para generar Excel
export async function generateExcel(title: string, period: string, attendances: any[], stats: any) {
  // Crear libro de trabajo
  const wb = XLSX.utils.book_new()

  // Hoja de estadísticas
  const statsData = [
    ["Reporte de Actividad"],
    [period],
    [""],
    ["Estadísticas"],
    ["Total de estudiantes atendidos", stats.totalStudents],
    ["Total de atenciones", stats.totalAttendances],
    ["Promedio diario de atenciones", stats.averageAttendancesPerDay.toFixed(1)],
    ["Tiempo total de sesión", `${Math.floor(stats.totalSessionTime / 60)}h ${stats.totalSessionTime % 60}m`],
    [""],
    ["Materias Atendidas"],
  ]

  // Agregar datos de materias
  stats.subjectStats.forEach((subject: any) => {
    statsData.push([subject.name, subject.count])
  })

  const statsWs = XLSX.utils.aoa_to_sheet(statsData)
  XLSX.utils.book_append_sheet(wb, statsWs, "Estadísticas")

  // Hoja de atenciones
  const attendancesData = [["Nombre", "ID", "Materia", "Descripción", "Fecha y Hora"]]

  attendances.forEach((attendance) => {
    attendancesData.push([
      attendance.person_name,
      attendance.person_id,
      attendance.subject,
      attendance.description,
      format(new Date(attendance.created_at), "dd/MM/yyyy HH:mm"),
    ])
  })

  const attendancesWs = XLSX.utils.aoa_to_sheet(attendancesData)
  XLSX.utils.book_append_sheet(wb, attendancesWs, "Atenciones")

  // Guardar Excel
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
  saveAs(blob, `${title.replace(/\s+/g, "_")}.xlsx`)
}

// Función para generar Word
export async function generateWord(title: string, period: string, attendances: any[], stats: any) {
  // Crear contenido para Word
  const content = `
    <h1>${title}</h1>
    <p>${period}</p>
    
    <h2>Estadísticas</h2>
    <ul>
      <li>Total de estudiantes atendidos: ${stats.totalStudents}</li>
      <li>Total de atenciones: ${stats.totalAttendances}</li>
      <li>Promedio diario de atenciones: ${stats.averageAttendancesPerDay.toFixed(1)}</li>
      <li>Tiempo total de sesión: ${Math.floor(stats.totalSessionTime / 60)}h ${stats.totalSessionTime % 60}m</li>
    </ul>
    
    <h2>Materias Atendidas</h2>
    <table>
      <tr>
        <th>Materia</th>
        <th>Cantidad</th>
      </tr>
      ${stats.subjectStats
        .map(
          (subject: any) => `
        <tr>
          <td>${subject.name}</td>
          <td>${subject.count}</td>
        </tr>
      `,
        )
        .join("")}
    </table>
    
    <h2>Lista de Atenciones</h2>
    <table>
      <tr>
        <th>Nombre</th>
        <th>ID</th>
        <th>Materia</th>
        <th>Fecha y Hora</th>
      </tr>
      ${attendances
        .map(
          (attendance) => `
        <tr>
          <td>${attendance.person_name}</td>
          <td>${attendance.person_id}</td>
          <td>${attendance.subject}</td>
          <td>${format(new Date(attendance.created_at), "dd/MM/yyyy HH:mm")}</td>
        </tr>
      `,
        )
        .join("")}
    </table>
  `

  // Convertir a HTML y descargar como archivo .doc
  const blob = new Blob([content], { type: "application/msword" })
  saveAs(blob, `${title.replace(/\s+/g, "_")}.doc`)
}
