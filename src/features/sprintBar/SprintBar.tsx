import { useState } from "react";
import { Button } from "../../shared/components/UI";
import { useAppStore } from "../../shared/context/AppStore";
import type { Page } from "../../shared/types/domain";

export function SprintBar({ page, go }: { page: Page; go: (page: Page) => void }) {
  const {
    role,
    students,
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

  const inactiveStudents = students.filter((s) => s.status === "Inactivo");
  const pickRandomInactive = () =>
    inactiveStudents.length > 0
      ? inactiveStudents[Math.floor(Math.random() * inactiveStudents.length)]
      : undefined;
  const pickRandomStudent = () =>
    students.length > 0 ? students[Math.floor(Math.random() * students.length)] : undefined;

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
              const target = pickRandomStudent();
              if (target) {
                simulateFileUpload(target.id, "Estudiante");
              }
            }}
          >
            + Archivo de Estudiante
          </Button>
          <Button
            onClick={() => {
              const target = pickRandomStudent();
              if (target) {
                simulateFileUpload(target.id, "Personal de Andino");
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
            const target = pickRandomInactive();
            if (target) {
              simulateFileUpload(target.id, "Estudiante");
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
