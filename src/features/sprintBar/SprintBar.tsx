import { useState } from "react";
import { Badge, Button } from "../../shared/components/UI";
import { useAppStore } from "../../shared/context/AppStore";
import type { Page } from "../../shared/types/domain";

export function SprintBar({ page, go }: { page: Page; go: (page: Page) => void }) {
  const {
    role,
    students,
    selectedStudentId,
    simulateWhatsAppGroup,
    simulateFileUpload,
    resetAll,
  } = useAppStore();
  const [visible, setVisible] = useState(true);

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

  const isStudents = page === "students" || page === "validation" || page === "student";
  const isDocs = page === "documents" || page === "review";
  const isAlerts = page === "alerts";
  const isHome = page === "home";

  return (
    <div className="sprint-bar">
      <span className="sprint-bar-label">Acciones rápidas:</span>

      {(isHome || isStudents) && role !== "Personal" && (
        <Button
          onClick={() => {
            simulateWhatsAppGroup();
            go("validation");
          }}
        >
          <Badge tone="blue">Estudiantes</Badge> + Nuevo grupo
        </Button>
      )}

      {(isHome || isStudents || isDocs) && (
        <Button
          onClick={() => {
            if (activeStudent) {
              simulateFileUpload(activeStudent.id, "Estudiante");
              go("documents");
            }
          }}
        >
          <Badge tone="green">Documentos</Badge> + Archivo estudiante
        </Button>
      )}

      {isDocs && (
        <Button
          onClick={() => {
            if (activeStudent) {
              simulateFileUpload(activeStudent.id, "Personal de Andino");
              go("documents");
            }
          }}
        >
          <Badge tone="gray">Documentos</Badge> + Archivo personal
        </Button>
      )}

      {(isHome || isAlerts) && (
        <Button
          onClick={() => {
            if (inactiveStudent) {
              simulateFileUpload(inactiveStudent.id, "Estudiante", "certificado_inactivo.pdf");
              go("alerts");
            }
          }}
        >
          <Badge tone="amber">Alertas</Badge> + Archivo inactivo
        </Button>
      )}

      <Button onClick={resetAll}>Reiniciar</Button>
      <Button onClick={() => setVisible(false)}>Ocultar</Button>
    </div>
  );
}
