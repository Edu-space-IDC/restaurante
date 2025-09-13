import { useState, useEffect } from 'react'
import { Users, UserCheck, UserX, Save, X, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { Badge } from './ui/badge'
import { 
  createStudentAttendanceRecord,
  getStudentAttendanceRecord,
  updateStudentAttendanceRecord,
  getCategoryDisplayName,
  type Grade,
  type Teacher,
  type StudentAttendanceRecord
} from '../utils/unifiedDatabase'

interface StudentAttendanceFormProps {
  teacher: Teacher
  selectedGradeInfo: Grade | null
  onSave?: (record: StudentAttendanceRecord) => void
  onCancel: () => void
}

export function StudentAttendanceForm({ teacher, selectedGradeInfo, onSave, onCancel }: StudentAttendanceFormProps) {
  const [studentsPresent, setStudentsPresent] = useState<number>(0)
  const [studentsEating, setStudentsEating] = useState<number>(0)
  const [studentsNotEating, setStudentsNotEating] = useState<number>(0)
  const [saving, setSaving] = useState(false)
  const [existingRecord, setExistingRecord] = useState<StudentAttendanceRecord | null>(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')

  const today = new Date().toISOString().split('T')[0]

  // Verificar si teacher y selectedGradeInfo están definidos
  if (!teacher || !selectedGradeInfo) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">Error: Información no disponible</p>
        </div>
        <p className="text-red-700 text-sm mt-2">
          {!teacher ? 'Información de maestro no disponible' : 'Debes seleccionar un grado primero'}
        </p>
        <Button onClick={onCancel} variant="outline" className="mt-3" size="sm">
          Cerrar
        </Button>
      </div>
    )
  }

  useEffect(() => {
    checkExistingRecord()
  }, [selectedGradeInfo.id, teacher.id])

  useEffect(() => {
    // Auto-calcular estudiantes que no comieron
    if (studentsPresent >= studentsEating) {
      setStudentsNotEating(studentsPresent - studentsEating)
    }
  }, [studentsPresent, studentsEating])

  const checkExistingRecord = async () => {
    if (!selectedGradeInfo?.id || !teacher?.id) return

    try {
      const record = await getStudentAttendanceRecord(teacher.id, selectedGradeInfo.id, today)
      if (record) {
        setExistingRecord(record)
        setStudentsPresent(record.studentsPresent)
        setStudentsEating(record.studentsEating)
        setStudentsNotEating(record.studentsNotEating)
        showMessage('Registro existente cargado para edición', 'info')
      } else {
        setExistingRecord(null)
        setStudentsPresent(0)
        setStudentsEating(0)
        setStudentsNotEating(0)
      }
    } catch (error) {
      console.error('Error verificando registro existente:', error)
    }
  }

  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => setMessage(''), 5000)
  }

  const handleSave = async () => {
    if (!teacher?.id || !teacher?.name) {
      showMessage('Error: Información de maestro no válida', 'error')
      return
    }

    if (!selectedGradeInfo?.id) {
      showMessage('Error: Información de grado no válida', 'error')
      return
    }

    if (studentsPresent < 0 || studentsEating < 0 || studentsNotEating < 0) {
      showMessage('Los números no pueden ser negativos', 'error')
      return
    }

    if (studentsEating > studentsPresent) {
      showMessage('El número de estudiantes que comieron no puede ser mayor que los presentes', 'error')
      return
    }

    if (studentsEating + studentsNotEating !== studentsPresent) {
      showMessage('La suma de estudiantes que comieron y no comieron debe igual a los presentes', 'error')
      return
    }

    setSaving(true)

    try {
      if (existingRecord) {
        // Actualizar registro existente
        const updatedRecord = await updateStudentAttendanceRecord(existingRecord.id, {
          studentsPresent,
          studentsEating,
          studentsNotEating
        })
        
        showMessage('Registro de asistencia actualizado correctamente', 'success')
        if (onSave) onSave(updatedRecord)
      } else {
        // Crear nuevo registro
        const newRecord = await createStudentAttendanceRecord({
          teacherId: teacher.id,
          teacherName: teacher.name,
          gradeId: selectedGradeInfo.id,
          gradeName: selectedGradeInfo.name,
          date: today,
          studentsPresent,
          studentsEating,
          studentsNotEating
        })
        
        showMessage('Registro de asistencia guardado correctamente', 'success')
        if (onSave) onSave(newRecord)
      }

      // Cerrar formulario después de un breve delay
      setTimeout(() => {
        onCancel()
      }, 1500)

    } catch (error) {
      console.error('Error guardando registro:', error)
      showMessage('Error al guardar el registro de asistencia', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header del formulario */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h3 className="text-lg font-medium text-black-soft">Registro de Asistencia</h3>
          <p className="text-sm text-muted-foreground">
            {existingRecord ? 'Editar registro existente' : 'Nuevo registro de asistencia'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="hover:bg-red-50 hover:text-red-600"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Mensaje de estado */}
      {message && (
        <Alert className={`${
          messageType === 'success' ? 'border-green-200 bg-green-50' :
          messageType === 'error' ? 'border-red-200 bg-red-50' :
          'border-blue-200 bg-blue-50'
        }`}>
          {messageType === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : messageType === 'error' ? (
            <AlertCircle className="h-4 w-4 text-red-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-blue-600" />
          )}
          <AlertDescription className={`${
            messageType === 'success' ? 'text-green-800' :
            messageType === 'error' ? 'text-red-800' :
            'text-blue-800'
          }`}>
            {message}
          </AlertDescription>
        </Alert>
      )}

      {/* Información del grado y fecha */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-blue-900">{selectedGradeInfo.name}</h4>
          <Badge variant="outline" className="text-blue-700 border-blue-300">
            {getCategoryDisplayName(selectedGradeInfo.category)}
          </Badge>
        </div>
        <p className="text-blue-800 text-sm mb-2">
          {selectedGradeInfo.description || `Grado ${selectedGradeInfo.name} - ${getCategoryDisplayName(selectedGradeInfo.category)}`}
        </p>
        <p className="text-blue-700 text-xs">
          Fecha: {new Date(today).toLocaleDateString('es-ES', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </div>

      {/* Formulario de asistencia */}
      <div className="grid grid-cols-1 gap-6">
        {/* Estudiantes presentes */}
        <div className="space-y-2">
          <Label htmlFor="present" className="flex items-center gap-2 text-black-soft">
            <UserCheck className="w-4 h-4 text-green-600" />
            Estudiantes Presentes
          </Label>
          <Input
            id="present"
            type="number"
            min="0"
            value={studentsPresent || ''}
            onChange={(e) => setStudentsPresent(Number(e.target.value) || 0)}
            className="text-center text-lg font-mono h-12"
            placeholder="0"
          />
          <p className="text-xs text-muted-foreground text-center">
            Total de estudiantes que asistieron al comedor
          </p>
        </div>

        {/* Estudiantes que comieron */}
        <div className="space-y-2">
          <Label htmlFor="eating" className="flex items-center gap-2 text-black-soft">
            <Users className="w-4 h-4 text-blue-600" />
            Estudiantes que Comieron
          </Label>
          <Input
            id="eating"
            type="number"
            min="0"
            max={studentsPresent}
            value={studentsEating || ''}
            onChange={(e) => setStudentsEating(Number(e.target.value) || 0)}
            className="text-center text-lg font-mono h-12"
            placeholder="0"
          />
          <p className="text-xs text-muted-foreground text-center">
            Estudiantes que consumieron el almuerzo
          </p>
        </div>

        {/* Estudiantes que no comieron (calculado automáticamente) */}
        <div className="space-y-2">
          <Label htmlFor="not-eating" className="flex items-center gap-2 text-black-soft">
            <UserX className="w-4 h-4 text-red-600" />
            Estudiantes que NO Comieron
          </Label>
          <Input
            id="not-eating"
            type="number"
            value={studentsNotEating || ''}
            className="text-center text-lg font-mono h-12 bg-gray-50"
            disabled
          />
          <p className="text-xs text-muted-foreground text-center">
            Se calcula automáticamente (Presentes - Comieron)
          </p>
        </div>
      </div>

      {/* Resumen visual */}
      {studentsPresent > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-3">Resumen</h4>
          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
            <div className="flex justify-between">
              <span className="text-green-800">Total presente:</span>
              <span className="font-mono font-medium">{studentsPresent}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-800">% que comió:</span>
              <span className="font-mono font-medium">
                {studentsPresent > 0 ? Math.round((studentsEating / studentsPresent) * 100) : 0}%
              </span>
            </div>
          </div>
          
          {/* Barra de progreso visual */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-600 h-3 rounded-full transition-all duration-300" 
              style={{ 
                width: `${studentsPresent > 0 ? (studentsEating / studentsPresent) * 100 : 0}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Validación visual */}
      {studentsEating > studentsPresent && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            El número de estudiantes que comieron no puede ser mayor que los presentes
          </AlertDescription>
        </Alert>
      )}

      {/* Botones de acción */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={saving}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          disabled={saving || studentsEating > studentsPresent}
        >
          {saving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Guardando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {existingRecord ? 'Actualizar' : 'Guardar'}
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}