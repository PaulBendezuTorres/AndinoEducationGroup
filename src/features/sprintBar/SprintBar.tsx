import { useState } from "react";
import { Button } from "../../shared/components/UI";
import { useAppStore } from "../../shared/context/AppStore";
import type { Page } from "../../shared/types/domain";

export function SprintBar({ page, go }: { page: Page; go: (page: Page) => void }) {
  const {
    role,
    students,
    selectedStudentId,
    simulateWhatsAppGroup,
    simulateRandomStudent,
    simulateFileUpload,
    resetAll,
  } = useAppStore();
  const [visible, setVisible] = useState(true);

  const isStudents = page === "students" || page === "validation" || page === "student";
  const isDocs = page === "documents" || page === "review";
  const isAlerts = page === "alerts";

  const hasActions = (isStudents && role !== "Personal") || isDocs || isAlerts;
  if (!hasActions) return null;

  const inactiveStudent = students.find((s) => s.status === "Inactivo");
  const activeStudent = students.find((s) => s.id === selectedStudentId) ?? students[0];

  if (!visible) {
    return (
      <div className="sprint-bar">
        <span className="sprint-bar-label">Acciones rápidas ocultas</span>
        <Button onClick={() => setVisible(true)}>Mostrar acciones</Button>
      </div>
    );
  }

  return (
    <div className="sprint-bar">
      <span className="sprint-bar-label">Acciones rápidas:</span>

      {isStudents && role !== "Personal" && (
        <>
          <Button
            onClick={() => {
              simulateWhatsAppGroup();
              go("validation");
            }}
          >
            + Grupo WhatsApp detectado
          </Button>
          <Button onClick={simulateRandomStudent}>+ Agregar estudiante</Button>
        </>
      )}

      {isDocs && (
        <>
          <Button
            onClick={() => {
              if (activeStudent) {
                simulateFileUpload(activeStudent.id, "Estudiante");
              }
            }}
          >
            + Archivo de Estudiante
          </Button>
          <Button
            onClick={() => {
              if (activeStudent) {
                simulateFileUpload(activeStudent.id, "Personal de Andino");
              }
            }}
          >
            + Archivo de Personal
          </Button>
        </>
      )}

      {isAlerts && (
        <Button
          onClick={() => {
            if (inactiveStudent) {
              simulateFileUpload(inactiveStudent.id, "Estudiante", "certificado_inactivo.pdf");
            }
          }}
        >
          + Archivo de Inactivo
        </Button>
      )}

      <Button onClick={resetAll}>Reiniciar</Button>
      <Button onClick={() => setVisible(false)}>Ocultar</Button>
    </div>
  );
}
