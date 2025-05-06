import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Clock, AlertTriangle, CheckCircle } from "lucide-react"

// Modificar la interfaz para incluir la hora de fin programada
interface PunctualityInfoProps {
  scheduledTime: Date
  loginTime: Date
  punctualityMinutes: number
  scheduledEndTime?: Date | null
}

// Modificar el componente para mostrar la hora de fin programada
export default function PunctualityInfo({
  scheduledTime,
  loginTime,
  punctualityMinutes,
  scheduledEndTime,
}: PunctualityInfoProps) {
  const formattedScheduledTime = format(scheduledTime, "HH:mm", { locale: es })
  const formattedLoginTime = format(loginTime, "HH:mm", { locale: es })
  const formattedEndTime = scheduledEndTime ? format(scheduledEndTime, "HH:mm", { locale: es }) : null

  const isLate = punctualityMinutes > 0
  const isOnTime = punctualityMinutes <= 0

  return (
    <Card className={isLate ? "border-amber-300" : "border-green-300"}>
      <CardContent className="p-4">
        <div className="flex items-center">
          {isLate ? (
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          )}

          <div>
            <h3 className="font-medium">
              {isLate
                ? `Llegada tarde: ${punctualityMinutes} minutos`
                : isOnTime
                  ? "Llegada a tiempo"
                  : `Llegada anticipada: ${Math.abs(punctualityMinutes)} minutos`}
            </h3>

            <div className="flex items-center mt-1 text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>
                Hora programada: <strong>{formattedScheduledTime}</strong>
                {formattedEndTime && (
                  <>
                    {" "}
                    - <strong>{formattedEndTime}</strong>
                  </>
                )}
              </span>
              <span className="mx-2">•</span>
              <span>
                Hora de llegada: <strong>{formattedLoginTime}</strong>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
