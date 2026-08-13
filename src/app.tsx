import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AppProvider } from "@/context/AppContext";
import StatsPage from "@/pages/StatsPage/StatsPage";
import RecordsPage from "@/pages/RecordsPage/RecordsPage";
import SettingsPage from "@/pages/SettingsPage/SettingsPage";
import PersonDetailPage from "@/pages/PersonDetailPage/PersonDetailPage";
import EditRecordPage from "@/pages/EditRecordPage/EditRecordPage";
import AddRecordPage from "@/pages/AddRecordPage/AddRecordPage";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<StatsPage />} />
          <Route path="records" element={<RecordsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="person/:name" element={<PersonDetailPage />} />
          <Route path="edit/:id" element={<EditRecordPage />} />
          <Route path="add" element={<AddRecordPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppProvider>
  );
}
