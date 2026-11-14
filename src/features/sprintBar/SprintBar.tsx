import { Button } from "../../shared/components/UI";
import { useAppStore } from "../../shared/context/AppStore";
import type { Page } from "../../shared/types/domain";

export function SprintBar({ go }: { go: (page: Page) => void }) {
  const {
    students,
    selectedStudentId,
    simulateWhatsAppGroup,
    simulateFileUpload,
    resetAll,
  } = useAppStore();

  const inactiveStudent = students.find((s) => s.status === "Inactivo");
  const activeStudent = students.find((s) => s.id === selectedStudentId) ?? students[0];

  return (
    <div className="sprint-bar">
      <span className="sprint-bar-label">Acciones rápidas:</span>
      <Button
        onClick={() => {
          simulateWhatsAppGroup();
          go("validation");
        }}
      >
        + Nuevo grupo WhatsApp
      </Button>
      <Button
        onClick={() => {
          if (activeStudent) {
            simulateFileUpload(activeStudent.id, "Estudiante");
            go("documents");
          }
        }}
      >
        + Archivo de Estudiante
      </Button>
      <Button
        onClick={() => {
          if (activeStudent) {
            simulateFileUpload(activeStudent.id, "Personal de Andino");
            go("documents");
          }
        }}
      >
        + Archivo de Personal
      </Button>
      <Button
        onClick={() => {
          if (inactiveStudent) {
            simulateFileUpload(inactiveStudent.id, "Estudiante", "certificado_inactivo.pdf");
            go("alerts");
          }
        }}
      >
        + Archivo de Inactivo
      </Button>
      <Button onClick={resetAll}>Reiniciar</Button>
    </div>
  );
}
