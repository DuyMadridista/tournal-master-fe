import type { GroupStageSettings as GroupStageSettingsType } from "../../types/tournament"
import EditableField from "../ui-elements/EditableField"

interface GroupStageSettingsProps {
  settings: GroupStageSettingsType
  onSettingsChange?: (settings: GroupStageSettingsType) => void
}

export default function GroupStageSettings({ settings, onSettingsChange }: GroupStageSettingsProps) {
  console.log("GroupStageSettings", settings);
  
  const handleChange = (field: keyof GroupStageSettingsType, value: number) => {
    if (onSettingsChange) {
      onSettingsChange({
        ...settings,
        [field]: value,
      })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <EditableField
        label="Number of Groups"
        value={settings.numberOfGroups}
        type="number"
        onSave={(value) => handleChange("numberOfGroups", Number(value))}
      />
      <EditableField
        label="Teams per Group"
        value={settings.teamsPerGroup}
        type="number"
        onSave={(value) => handleChange("teamsPerGroup", Number(value))}
      />
      <EditableField
        label="Advance per Group"
        value={settings.advancePerGroup}
        type="number"
        onSave={(value) => handleChange("advancePerGroup", Number(value))}
      />
    </div>
  )
}
