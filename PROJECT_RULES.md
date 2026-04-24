# PROJECT_RULES.md (Frontend)

---

# 🎯 Project Overview

Perulytics-web es un dashboard interactivo que visualiza en tiempo real las tendencias electorales en Perú.

El sistema consume datos del backend de Perulytics y transforma la información en visualizaciones claras, enfocadas en la evolución del voto y la competencia entre candidatos.

---

# 🌐 Backend Base URL (PRODUCTION)

```text
https://perulytics-production.up.railway.app/
```

---

# 🔌 Available APIs (DOCUMENTED)

---

## 🟢 GET /

Healthcheck del sistema.

```bash
GET https://perulytics-production.up.railway.app/
```

### Response

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "perulytics-backend",
    "timestamp": "2026-04-24T12:41:04.218Z"
  },
  "error": null
}
```

---

## 📊 GET /analytics/results?codigos=8,10,35 (CRITICAL)

Endpoint principal para el frontend.

```bash
GET https://perulytics-production.up.railway.app/analytics/results?codigos=8,10,35
```

### Response (resumen)

* `currentSnapshotTimestamp`
* `previousSnapshotTimestamp`
* `results[]` con:

  * `porcentajeVotosValidos`
  * `totalVotosValidos`
  * `comparativoAnterior`

    * `deltaPorcentajeVotosValidos`
    * `deltaVotosValidos`

---

# 🧠 Data Interpretation (CRITICAL)

* Código **8** → ya clasificado
* Código **10 vs 35** → disputa directa

Ejemplo real:

```text
12.034% vs 11.907%
Diferencia: 0.127% → Cerrado
```

---

## ⚡ Momentum

Usar:

```text
comparativoAnterior.deltaPorcentajeVotosValidos
```

---

## 📡 GET /ingestion/status

Estado del sistema.

```bash
GET https://perulytics-production.up.railway.app/ingestion/status
```

Incluye:

* última ejecución
* timestamp del snapshot
* participación ciudadana
* % actas contabilizadas

---

## 📈 GET /analytics/trends (CRITICAL)

Serie temporal de un candidato.

```bash
GET https://perulytics-production.up.railway.app/analytics/trends?codigoAgrupacionPolitica=10&limit=120
```

---

### Response

```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2026-04-24T04:30:00.472Z",
      "porcentajeVotosValidos": 17.053,
      "porcentajeVotosEmitidos": 14.204,
      "totalVotosValidos": 2727843
    }
  ],
  "error": null
}
```

---

## 📊 Trends Interpretation Rules

* Cada elemento representa un snapshot en el tiempo
* `timestamp` → eje X (tiempo)
* `porcentajeVotosValidos` → eje Y (principal)
* `totalVotosValidos` → contexto adicional

---

## 🎯 Uso en frontend (CRITICAL)

* SOLO usar trends para:

  * código 10
  * código 35

* NO usar trends para todos los candidatos

* NO mezclar múltiples candidatos innecesarios

---

## 📈 Visualización correcta

El gráfico debe:

* comparar 10 vs 35
* mostrar evolución temporal
* resaltar cruces o acercamientos

---

# 🎯 Core Objective

> **Responder visualmente:**
> ¿Quién está ganando la disputa por el segundo lugar?

---

# 🧩 Data Scope (CRITICAL)

Solo usar:

* 8 (clasificado)
* 10 (en disputa)
* 35 (en disputa)

---

# ⚔️ Second Place Battle (CRITICAL)

Debe mostrar:

* diferencia de porcentaje
* diferencia de votos
* tendencia reciente
* momentum

---

## 🔥 Clasificación de diferencia

* `< 0.1%` → Muy reñido
* `< 0.5%` → Cerrado
* `>= 0.5%` → Definido

---

# 🔄 Real-Time Behavior

* Permitir polling
* Refrescar datos periódicamente
* Mantener sincronía con backend

---

# 🎨 UX Rules

Prioridad visual:

1. Batalla 10 vs 35
2. Diferencia actual
3. Tendencia (gráfico)
4. Contexto general

---

# ⚠️ What to Avoid

* Mostrar todos los candidatos
* Gráficos innecesarios
* UI saturada
* Datos sin interpretación

---

# 🔒 Data Integrity

* No modificar datos del backend
* No recalcular lógica compleja
* Usar directamente los valores entregados

---

# 🔒 Error Handling

* Manejar estados vacíos
* Mostrar loading states
* Evitar errores visibles

---

# ⚙️ Environment Rules

* Usar variables de entorno
* No hardcodear endpoints

---

# 🧠 Narrative Rule (CRITICAL)

El sistema debe comunicar:

> **La tensión entre el candidato 10 y 35 por el segundo lugar**

---

# 🧠 Mindset

* Interpretar datos
* Reducir ruido
* Mostrar lo importante
* Contar una historia clara
