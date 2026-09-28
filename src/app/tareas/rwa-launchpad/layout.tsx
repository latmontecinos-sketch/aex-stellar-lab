import { TaskLayout } from "@/components/task-layout";
import { taskBySlug } from "@/content/tasks";

export default function RwaLaunchpadLayout({ children }: LayoutProps<"/tareas/rwa-launchpad">) {
  return <TaskLayout task={taskBySlug("rwa-launchpad")}>{children}</TaskLayout>;
}
