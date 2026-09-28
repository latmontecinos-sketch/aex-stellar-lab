import { TaskLayout } from "@/components/task-layout";
import { taskBySlug } from "@/content/tasks";

export default function AexPassLayout({ children }: LayoutProps<"/tareas/aex-pass">) {
  return <TaskLayout task={taskBySlug("aex-pass")}>{children}</TaskLayout>;
}
