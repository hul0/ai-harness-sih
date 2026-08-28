"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface PIDSchematicSVGProps {
  drawingId: string
  selectedNodeId: string | null
  hoveredNodeId: string | null
  onNodeClick: (nodeId: string) => void
  onNodeHover: (nodeId: string | null) => void
  showPipelines: boolean
}

export function PIDSchematicSVG({
  drawingId,
  selectedNodeId,
  hoveredNodeId,
  onNodeClick,
  onNodeHover,
  showPipelines,
}: PIDSchematicSVGProps) {
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/dexpi/${drawingId}.svg`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load DEXPI SVG")
        return res.text()
      })
      .then((svgText) => {
        setSvgMarkup(svgText)
        setLoading(false)
      })
      .catch(() => {
        setSvgMarkup(null)
        setLoading(false)
      })
  }, [drawingId])

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full text-xs text-muted-foreground animate-pulse">
        Loading pyDEXPI CAD Vector Schematic...
      </div>
    )
  }

  // Render the actual pyDEXPI SVG directly with interactive event delegation
  if (svgMarkup) {
    return (
      <div
        className="relative w-full h-full flex items-center justify-center select-none"
        onClick={(e) => {
          const target = e.target as SVGElement
          const elemId = target?.id || target?.parentElement?.id || ""
          if (elemId) {
            onNodeClick(elemId)
          }
        }}
        onMouseOver={(e) => {
          const target = e.target as SVGElement
          const elemId = target?.id || target?.parentElement?.id || ""
          if (elemId) {
            onNodeHover(elemId)
          }
        }}
        onMouseOut={() => onNodeHover(null)}
      >
        <div
          className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:object-contain [&_polyline]:transition-all [&_polygon]:transition-all [&_ellipse]:transition-all hover:[&_polyline]:stroke-emerald-400 hover:[&_polygon]:stroke-emerald-400 hover:[&_ellipse]:stroke-emerald-400 cursor-pointer"
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      </div>
    )
  }

  // Fallback if SVG not found
  return (
    <DistillationSchematicSVG
      selectedNodeId={selectedNodeId}
      hoveredNodeId={hoveredNodeId}
      onNodeClick={onNodeClick}
      onNodeHover={onNodeHover}
      showPipelines={showPipelines}
    />
  )
}

/* =========================================================================
   1. Atmospheric Distillation Column (C-101) Detailed Vector Schematic
   ========================================================================= */
interface SubSvgProps extends Omit<PIDSchematicSVGProps, "drawingId" | "showPipelines"> {
  showPipelines?: boolean
  dexpiSvg?: string | null
}

function DistillationSchematicSVG({
  selectedNodeId,
  hoveredNodeId,
  onNodeClick,
  onNodeHover,
  showPipelines,
  dexpiSvg,
}: SubSvgProps) {
  const isSel = (id: string) => selectedNodeId === id
  const isHov = (id: string) => hoveredNodeId === id
  const getStyle = (id: string) => {
    if (isSel(id)) return { stroke: "#10b981", strokeWidth: 3, fill: "rgba(16, 185, 129, 0.25)" }
    if (isHov(id)) return { stroke: "#f59e0b", strokeWidth: 2.5, fill: "rgba(245, 158, 11, 0.2)" }
    return { stroke: "#d4d4d4", strokeWidth: 1.8, fill: "rgba(26, 26, 26, 0.85)" }
  }

  return (
    <svg viewBox="0 0 1000 600" className="w-full h-full font-sans select-none">
      <defs>
        <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#10b981" />
        </marker>
        <marker id="arrow-cyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8" />
        </marker>
        <marker id="arrow-muted" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#737373" />
        </marker>
        <pattern id="trayPattern" width="10" height="14" patternUnits="userSpaceOnUse">
          <line x1="0" y1="7" x2="10" y2="7" stroke="#525252" strokeWidth="1" strokeDasharray="3 2" />
        </pattern>
      </defs>

      {/* PIPELINES LAYER */}
      {showPipelines && (
        <g className="pipelines">
          {/* Main Crude Feed Line: Inlet -> V-102 */}
          <path d="M 20 320 L 70 320" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow-green)" />
          {/* V-102 -> P-101A */}
          <path d="M 140 370 L 140 440 L 220 440" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow-green)" />
          {/* P-101A -> FCV-101 -> C-101 Flash Zone */}
          <path d="M 260 440 L 370 440 L 370 320 L 460 320" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow-green)" />
          {/* PT-301 Instrument Impulse Line */}
          <path d="M 310 440 L 310 370" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
          {/* C-101 Overhead Vapor -> E-101 */}
          <path d="M 520 80 L 520 50 L 730 50 L 730 115" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrow-cyan)" />
          {/* E-101 -> V-103 Reflux Drum */}
          <path d="M 760 170 L 760 210 L 800 210" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrow-cyan)" />
          {/* V-103 -> P-102 Reflux Pump */}
          <path d="M 860 260 L 860 400 L 800 400" stroke="#737373" strokeWidth="2.5" markerEnd="url(#arrow-muted)" />
          {/* P-102 -> FCV-102 -> C-101 Top Tray Reflux */}
          <path d="M 760 400 L 680 400 L 680 140 L 580 140" stroke="#737373" strokeWidth="2.5" markerEnd="url(#arrow-muted)" />
          {/* C-101 Bottom Residue Draw */}
          <path d="M 520 520 L 520 560 L 640 560" stroke="#e11d48" strokeWidth="3" markerEnd="url(#arrow-muted)" />

          {/* Clean Line Labels with background badges */}
          <rect x="25" y="295" width="76" height="16" rx="4" fill="#171717" stroke="#333333" />
          <text x="63" y="307" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">14"-CRD-1001</text>

          <rect x="360" y="295" width="85" height="16" rx="4" fill="#171717" stroke="#333333" />
          <text x="402" y="307" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">Feed (280°C)</text>

          <rect x="580" y="35" width="95" height="16" rx="4" fill="#171717" stroke="#333333" />
          <text x="627" y="47" fill="#38bdf8" fontSize="9" fontWeight="600" textAnchor="middle">20" Vapor (115°C)</text>
        </g>
      )}

      {/* EQUIPMENT NODES */}

      {/* V-102: Horizontal Surge Drum */}
      <g
        onClick={() => onNodeClick("node-c101-v102")}
        onMouseEnter={() => onNodeHover("node-c101-v102")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        <rect x="70" y="290" width="80" height="60" rx="20" style={getStyle("node-c101-v102")} />
        <line x1="85" y1="350" x2="85" y2="365" stroke="#737373" strokeWidth="3" />
        <line x1="135" y1="350" x2="135" y2="365" stroke="#737373" strokeWidth="3" />
        
        {/* Label Badge */}
        <rect x="78" y="308" width="64" height="24" rx="4" fill="#171717" stroke="#404040" strokeWidth="1" />
        <text x="110" y="320" fill="#f5f5f5" fontSize="11" fontWeight="700" textAnchor="middle">V-102</text>
        <text x="110" y="329" fill="#a3a3a3" fontSize="8" textAnchor="middle">Surge Drum</text>
      </g>

      {/* P-101A: Centrifugal Charge Pump */}
      <g
        onClick={() => onNodeClick("node-c101-p101a")}
        onMouseEnter={() => onNodeHover("node-c101-p101a")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        <circle cx="240" cy="440" r="22" style={getStyle("node-c101-p101a")} />
        <path d="M 240 418 L 260 418 L 260 440" fill="none" stroke="#f5f5f5" strokeWidth="1.5" />
        <rect x="212" y="468" width="56" height="18" rx="4" fill="#171717" stroke="#404040" />
        <text x="240" y="481" fill="#f5f5f5" fontSize="10" fontWeight="700" textAnchor="middle">P-101A</text>
      </g>

      {/* PT-301: Pressure Transmitter */}
      <g
        onClick={() => onNodeClick("node-c101-pt301")}
        onMouseEnter={() => onNodeHover("node-c101-pt301")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        <circle cx="310" cy="350" r="18" style={getStyle("node-c101-pt301")} />
        <line x1="292" y1="350" x2="328" y2="350" stroke="#737373" strokeWidth="1" />
        <rect x="292" y="372" width="36" height="16" rx="4" fill="#171717" stroke="#404040" />
        <text x="310" y="384" fill="#f5f5f5" fontSize="9" fontWeight="700" textAnchor="middle">PT-301</text>
      </g>

      {/* FCV-101: Control Valve */}
      <g
        onClick={() => onNodeClick("node-c101-fcv101")}
        onMouseEnter={() => onNodeHover("node-c101-fcv101")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        <polygon points="360,430 380,440 360,450" style={getStyle("node-c101-fcv101")} />
        <polygon points="380,430 360,440 380,450" style={getStyle("node-c101-fcv101")} />
        <line x1="370" y1="430" x2="370" y2="415" stroke="#f5f5f5" strokeWidth="1.5" />
        <path d="M 360 415 Q 370 405 380 415 Z" fill="#525252" stroke="#f5f5f5" strokeWidth="1" />
        <rect x="340" y="388" width="60" height="16" rx="4" fill="#171717" stroke="#404040" />
        <text x="370" y="400" fill="#f5f5f5" fontSize="9" fontWeight="700" textAnchor="middle">FCV-101</text>
      </g>

      {/* C-101: Atmospheric Distillation Column */}
      <g
        onClick={() => onNodeClick("node-c101-c101")}
        onMouseEnter={() => onNodeHover("node-c101-c101")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        <rect x="460" y="80" width="120" height="440" rx="30" style={getStyle("node-c101-c101")} />
        <rect x="470" y="110" width="100" height="380" fill="url(#trayPattern)" opacity="0.6" />
        <rect x="460" y="312" width="120" height="16" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
        
        {/* Central Clean Header Badge */}
        <rect x="470" y="240" width="100" height="54" rx="8" fill="#171717" stroke="#404040" strokeWidth="1" />
        <text x="520" y="258" fill="#ffffff" fontSize="14" fontWeight="800" textAnchor="middle">C-101</text>
        <text x="520" y="272" fill="#d4d4d4" fontSize="9" textAnchor="middle">Distillation Column</text>
        <text x="520" y="284" fill="#10b981" fontSize="8" textAnchor="middle">(36 Valve Trays)</text>

        <path d="M 470 520 L 460 550 L 580 550 L 570 520 Z" fill="#262626" stroke="#737373" strokeWidth="1.5" />
      </g>

      {/* E-101: Overhead Condenser */}
      <g
        onClick={() => onNodeClick("node-c101-e101")}
        onMouseEnter={() => onNodeHover("node-c101-e101")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        <circle cx="740" cy="145" r="30" style={getStyle("node-c101-e101")} />
        <path d="M 720 135 L 735 155 L 745 135 L 760 155" fill="none" stroke="#38bdf8" strokeWidth="2" />
        <rect x="712" y="180" width="56" height="18" rx="4" fill="#171717" stroke="#404040" />
        <text x="740" y="193" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">E-101</text>
      </g>

      {/* V-103: Reflux Drum */}
      <g
        onClick={() => onNodeClick("node-c101-v103")}
        onMouseEnter={() => onNodeHover("node-c101-v103")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        <rect x="800" y="180" width="100" height="55" rx="16" style={getStyle("node-c101-v103")} />
        <rect x="870" y="235" width="20" height="20" rx="4" style={getStyle("node-c101-v103")} />
        <rect x="815" y="192" width="70" height="30" rx="4" fill="#171717" stroke="#404040" />
        <text x="850" y="206" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">V-103</text>
        <text x="850" y="217" fill="#a3a3a3" fontSize="8" textAnchor="middle">Reflux Drum</text>
      </g>

      {/* P-102: Reflux Pump */}
      <g
        onClick={() => onNodeClick("node-c101-p102")}
        onMouseEnter={() => onNodeHover("node-c101-p102")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        <circle cx="780" cy="400" r="20" style={getStyle("node-c101-p102")} />
        <rect x="754" y="425" width="52" height="18" rx="4" fill="#171717" stroke="#404040" />
        <text x="780" y="438" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">P-102</text>
      </g>

      {/* FCV-102: Reflux Flow Valve */}
      <g
        onClick={() => onNodeClick("node-c101-fcv102")}
        onMouseEnter={() => onNodeHover("node-c101-fcv102")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        <polygon points="670,240 690,250 670,260" style={getStyle("node-c101-fcv102")} />
        <polygon points="690,240 670,250 690,260" style={getStyle("node-c101-fcv102")} />
        <line x1="680" y1="240" x2="680" y2="225" stroke="#f5f5f5" strokeWidth="1.5" />
        <path d="M 670 225 Q 680 215 690 225 Z" fill="#525252" stroke="#f5f5f5" strokeWidth="1" />
        <rect x="650" y="198" width="60" height="16" rx="4" fill="#171717" stroke="#404040" />
        <text x="680" y="210" fill="#f5f5f5" fontSize="9" fontWeight="700" textAnchor="middle">FCV-102</text>
      </g>
    </svg>
  )
}

/* =========================================================================
   2. Diesel Hydrodesulfurization (DHDS) Loop Vector Schematic
   ========================================================================= */
function HDSSchematicSVG({
  selectedNodeId,
  hoveredNodeId,
  onNodeClick,
  onNodeHover,
  showPipelines,
  dexpiSvg,
}: SubSvgProps) {
  const isSel = (id: string) => selectedNodeId === id
  const isHov = (id: string) => hoveredNodeId === id
  const getStyle = (id: string) => {
    if (isSel(id)) return { stroke: "#10b981", strokeWidth: 3, fill: "rgba(16, 185, 129, 0.2)" }
    if (isHov(id)) return { stroke: "#f59e0b", strokeWidth: 2.5, fill: "rgba(245, 158, 11, 0.15)" }
    return { stroke: "#a3a3a3", strokeWidth: 1.5, fill: "rgba(38, 38, 38, 0.7)" }
  }

  return (
    <svg viewBox="0 0 1000 600" className="w-full h-full font-sans select-none">
      {showPipelines && (
        <g className="pipelines">
          {/* Feed -> H-201 Furnace */}
          <path d="M 40 320 L 100 320" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow-green)" />
          {/* H-201 -> R-201 Reactor */}
          <path d="M 220 320 L 320 320 L 320 160 L 380 160" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow-green)" />
          <text x="240" y="310" fill="#10b981" fontSize="11" fontWeight="600">Feed to Reactor (345°C @ 65 bar)</text>
          {/* BDV-201 Flare line */}
          <path d="M 430 110 L 430 50 L 500 50" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
          <text x="440" y="40" fill="#ef4444" fontSize="10">Emergency Blowdown to Flare</text>
          {/* R-201 Effluent -> E-201 */}
          <path d="M 430 480 L 430 520 L 600 520 L 600 360" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrow-green)" />
          {/* E-201 -> V-201 Separator */}
          <path d="M 640 320 L 720 320" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrow-green)" />
          {/* V-201 Recycle Gas -> K-201 Compressor */}
          <path d="M 760 180 L 760 120 L 860 120" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#arrow-cyan)" />
          {/* K-201 -> Recycle Loop back to H-201 */}
          <path d="M 900 120 L 960 120 L 960 560 L 80 560 L 80 340 L 100 340" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 3" />
        </g>
      )}

      {/* H-201: Fired Cabin Heater */}
      <g
        onClick={() => onNodeClick("node-hds-h201")}
        onMouseEnter={() => onNodeHover("node-hds-h201")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        <polygon points="100,240 130,190 190,190 220,240 220,380 100,380" style={getStyle("node-hds-h201")} />
        {/* Radiant coil tube lines */}
        <path d="M 120 250 L 200 250 L 200 270 L 120 270 L 120 290 L 200 290" fill="none" stroke="#f59e0b" strokeWidth="2" />
        {/* Burner arrows */}
        <path d="M 140 370 L 140 350 M 160 370 L 160 350 M 180 370 L 180 350" stroke="#ef4444" strokeWidth="2" />
        <text x="160" y="320" fill="#ffffff" fontSize="14" fontWeight="800" textAnchor="middle">H-201</text>
        <text x="160" y="335" fill="#a3a3a3" fontSize="9" textAnchor="middle">Fired Heater</text>
      </g>

      {/* R-201: Fixed Bed Reactor */}
      <g
        onClick={() => onNodeClick("node-hds-r201")}
        onMouseEnter={() => onNodeHover("node-hds-r201")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        <rect x="380" y="110" width="100" height="370" rx="30" style={getStyle("node-hds-r201")} />
        {/* Catalyst Bed Hatching */}
        <rect x="390" y="160" width="80" height="120" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
        <rect x="390" y="310" width="80" height="130" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
        <text x="430" y="230" fill="#ffffff" fontSize="16" fontWeight="800" textAnchor="middle">R-201</text>
        <text x="430" y="248" fill="#d4d4d4" fontSize="10" textAnchor="middle">HDS Reactor</text>
        <text x="430" y="262" fill="#a3a3a3" fontSize="9" textAnchor="middle">(CoMo Catalyst)</text>
      </g>

      {/* BDV-201: Emergency Blowdown Valve */}
      <g
        onClick={() => onNodeClick("node-hds-bdv201")}
        onMouseEnter={() => onNodeHover("node-hds-bdv201")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        <polygon points="420,70 440,80 420,90" style={getStyle("node-hds-bdv201")} />
        <polygon points="440,70 420,80 440,90" style={getStyle("node-hds-bdv201")} />
        <text x="460" y="84" fill="#ef4444" fontSize="10" fontWeight="700">BDV-201</text>
      </g>

      {/* E-201: Feed/Effluent Exchanger */}
      <g
        onClick={() => onNodeClick("node-hds-e201")}
        onMouseEnter={() => onNodeHover("node-hds-e201")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        <circle cx="600" cy="320" r="35" style={getStyle("node-hds-e201")} />
        <path d="M 575 310 L 600 330 L 625 310" fill="none" stroke="#10b981" strokeWidth="2.5" />
        <text x="600" y="324" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">E-201</text>
        <text x="600" y="370" fill="#a3a3a3" fontSize="9" textAnchor="middle">Heat Recovery</text>
      </g>

      {/* V-201: High Pressure Separator */}
      <g
        onClick={() => onNodeClick("node-hds-v201")}
        onMouseEnter={() => onNodeHover("node-hds-v201")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        <rect x="720" y="180" width="80" height="240" rx="25" style={getStyle("node-hds-v201")} />
        {/* Demister Pad */}
        <line x1="730" y1="220" x2="790" y2="220" stroke="#38bdf8" strokeWidth="3" strokeDasharray="3 2" />
        <text x="760" y="290" fill="#ffffff" fontSize="13" fontWeight="700" textAnchor="middle">V-201</text>
        <text x="760" y="306" fill="#a3a3a3" fontSize="9" textAnchor="middle">HP Separator</text>
      </g>

      {/* K-201: Recycle Gas Compressor */}
      <g
        onClick={() => onNodeClick("node-hds-k201")}
        onMouseEnter={() => onNodeHover("node-hds-k201")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        {/* Trapezoid casing */}
        <polygon points="860,90 920,105 920,135 860,150" style={getStyle("node-hds-k201")} />
        <text x="890" y="125" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">K-201</text>
        <text x="890" y="170" fill="#a3a3a3" fontSize="9" textAnchor="middle">H₂ Compressor</text>
      </g>
    </svg>
  )
}

/* =========================================================================
   3. Overhead Condenser & Naphtha Stabilizer Vector Schematic
   ========================================================================= */
function OverheadSchematicSVG({
  selectedNodeId,
  hoveredNodeId,
  onNodeClick,
  onNodeHover,
  showPipelines,
  dexpiSvg,
}: SubSvgProps) {
  const isSel = (id: string) => selectedNodeId === id
  const isHov = (id: string) => hoveredNodeId === id
  const getStyle = (id: string) => {
    if (isSel(id)) return { stroke: "#10b981", strokeWidth: 3, fill: "rgba(16, 185, 129, 0.2)" }
    if (isHov(id)) return { stroke: "#f59e0b", strokeWidth: 2.5, fill: "rgba(245, 158, 11, 0.15)" }
    return { stroke: "#a3a3a3", strokeWidth: 1.5, fill: "rgba(38, 38, 38, 0.7)" }
  }

  return (
    <svg viewBox="0 0 1000 600" className="w-full h-full font-sans select-none">
      {showPipelines && (
        <g className="pipelines">
          {/* Overhead Vapor 24" -> E-105 Fin-Fan */}
          <path d="M 40 200 L 140 200" stroke="#38bdf8" strokeWidth="3" />
          <text x="50" y="190" fill="#38bdf8" fontSize="11">24"-OVH-1051</text>
          {/* E-105 -> V-103 Accumulator */}
          <path d="M 280 200 L 400 200 L 400 280" stroke="#38bdf8" strokeWidth="3" />
          {/* Off-gas vent -> PCV-105 */}
          <path d="M 440 260 L 440 140 L 520 140" stroke="#f59e0b" strokeWidth="2.5" />
          {/* V-103 -> Pumps P-103A/B */}
          <path d="M 480 340 L 480 440 L 620 440" stroke="#10b981" strokeWidth="3" />
          <path d="M 550 440 L 550 500 L 760 500" stroke="#10b981" strokeWidth="3" />
        </g>
      )}

      {/* E-105A/B: Fin-Fan Air Coolers */}
      <g
        onClick={() => onNodeClick("node-ovhd-e105")}
        onMouseEnter={() => onNodeHover("node-ovhd-e105")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        <rect x="140" y="150" width="140" height="90" rx="8" style={getStyle("node-ovhd-e105")} />
        {/* Fan blades */}
        <circle cx="180" cy="195" r="18" fill="none" stroke="#737373" strokeWidth="1.5" />
        <circle cx="240" cy="195" r="18" fill="none" stroke="#737373" strokeWidth="1.5" />
        <text x="210" y="180" fill="#ffffff" fontSize="13" fontWeight="700" textAnchor="middle">E-105A-D</text>
        <text x="210" y="225" fill="#a3a3a3" fontSize="9" textAnchor="middle">Fin-Fan Air Cooler Bank</text>
      </g>

      {/* V-103: Overhead Receiver with Boot */}
      <g
        onClick={() => onNodeClick("node-ovhd-v103")}
        onMouseEnter={() => onNodeHover("node-ovhd-v103")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        <rect x="360" y="260" width="160" height="80" rx="20" style={getStyle("node-ovhd-v103")} />
        {/* Sour water boot */}
        <rect x="470" y="340" width="30" height="35" rx="5" style={getStyle("node-ovhd-v103")} />
        <text x="440" y="298" fill="#ffffff" fontSize="14" fontWeight="800" textAnchor="middle">V-103</text>
        <text x="440" y="316" fill="#a3a3a3" fontSize="10" textAnchor="middle">Overhead Accumulator &amp; Boot</text>
      </g>

      {/* PCV-105: Pressure Control Valve */}
      <g
        onClick={() => onNodeClick("node-ovhd-pcv105")}
        onMouseEnter={() => onNodeHover("node-ovhd-pcv105")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        <polygon points="510,130 530,140 510,150" style={getStyle("node-ovhd-pcv105")} />
        <polygon points="530,130 510,140 530,150" style={getStyle("node-ovhd-pcv105")} />
        <text x="520" y="118" fill="#f5f5f5" fontSize="10" fontWeight="700" textAnchor="middle">PCV-105</text>
      </g>

      {/* P-103A: Reflux Pump */}
      <g
        onClick={() => onNodeClick("node-ovhd-p103a")}
        onMouseEnter={() => onNodeHover("node-ovhd-p103a")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        <circle cx="640" cy="440" r="22" style={getStyle("node-ovhd-p103a")} />
        <text x="640" y="444" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">P-103A</text>
        <text x="640" y="475" fill="#a3a3a3" fontSize="9" textAnchor="middle">Reflux Pump</text>
      </g>

      {/* P-103B: Naphtha Product Forwarding Pump */}
      <g
        onClick={() => onNodeClick("node-ovhd-p103b")}
        onMouseEnter={() => onNodeHover("node-ovhd-p103b")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer transition-all"
      >
        <circle cx="780" cy="500" r="22" style={getStyle("node-ovhd-p103b")} />
        <text x="780" y="504" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">P-103B</text>
        <text x="780" y="535" fill="#a3a3a3" fontSize="9" textAnchor="middle">CCR Forwarding</text>
      </g>
    </svg>
  )
}

/* =========================================================================
   4. ISA-5.1 Standard Symbology Vector Reference Sheet
   ========================================================================= */
function ISASymbolLibrarySVG({
  selectedNodeId,
  hoveredNodeId,
  onNodeClick,
  onNodeHover,
  dexpiSvg,
}: SubSvgProps) {
  const isSel = (id: string) => selectedNodeId === id
  const isHov = (id: string) => hoveredNodeId === id
  const getStyle = (id: string) => {
    if (isSel(id)) return { stroke: "#10b981", strokeWidth: 2.5, fill: "rgba(16, 185, 129, 0.25)" }
    if (isHov(id)) return { stroke: "#f59e0b", strokeWidth: 2, fill: "rgba(245, 158, 11, 0.15)" }
    return { stroke: "#737373", strokeWidth: 1.5, fill: "rgba(38, 38, 38, 0.5)" }
  }

  return (
    <svg viewBox="0 0 1000 620" className="w-full h-full font-sans select-none">
      {/* Column Headers */}
      <g fill="#a3a3a3" fontSize="11" fontWeight="700">
        <text x="100" y="30" textAnchor="middle">1. Columns &amp; Vessels</text>
        <text x="300" y="30" textAnchor="middle">2. Drums &amp; Separators</text>
        <text x="500" y="30" textAnchor="middle">3. Boilers &amp; Heating</text>
        <text x="700" y="30" textAnchor="middle">4. Storage Tanks</text>
        <text x="900" y="30" textAnchor="middle">5. Thermal Vessels</text>
      </g>

      <line x1="20" y1="42" x2="980" y2="42" stroke="#404040" strokeWidth="1" />
      <line x1="200" y1="20" x2="200" y2="600" stroke="#333333" strokeDasharray="4 4" />
      <line x1="400" y1="20" x2="400" y2="600" stroke="#333333" strokeDasharray="4 4" />
      <line x1="600" y1="20" x2="600" y2="600" stroke="#333333" strokeDasharray="4 4" />
      <line x1="800" y1="20" x2="800" y2="600" stroke="#333333" strokeDasharray="4 4" />

      {/* Column 1: Vertical Vessel */}
      <g
        onClick={() => onNodeClick("sym-vert-vessel")}
        onMouseEnter={() => onNodeHover("sym-vert-vessel")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer"
      >
        <rect x="50" y="60" width="35" height="70" rx="10" style={getStyle("sym-vert-vessel")} />
        <text x="100" y="100" fill="#f5f5f5" fontSize="10" fontWeight="600">Vertical Vessel</text>
      </g>

      {/* Column 1: Mixing Vessel */}
      <g
        onClick={() => onNodeClick("sym-mixing-vessel")}
        onMouseEnter={() => onNodeHover("sym-mixing-vessel")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer"
      >
        <rect x="50" y="160" width="35" height="50" rx="8" style={getStyle("sym-mixing-vessel")} />
        <line x1="67" y1="140" x2="67" y2="185" stroke="#f5f5f5" strokeWidth="1.5" />
        <path d="M 60 185 Q 67 195 74 185" fill="none" stroke="#f5f5f5" strokeWidth="1.5" />
        <text x="100" y="190" fill="#f5f5f5" fontSize="10" fontWeight="600">Mixing Vessel</text>
      </g>

      {/* Column 1: Standard Column */}
      <g
        onClick={() => onNodeClick("sym-column")}
        onMouseEnter={() => onNodeHover("sym-column")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer"
      >
        <rect x="50" y="240" width="35" height="85" rx="10" style={getStyle("sym-column")} />
        <text x="100" y="290" fill="#f5f5f5" fontSize="10" fontWeight="600">Column</text>
      </g>

      {/* Column 1: Tray Column */}
      <g
        onClick={() => onNodeClick("sym-tray-col")}
        onMouseEnter={() => onNodeHover("sym-tray-col")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer"
      >
        <rect x="50" y="350" width="35" height="95" rx="10" style={getStyle("sym-tray-col")} />
        <line x1="55" y1="375" x2="80" y2="375" stroke="#f59e0b" strokeDasharray="2 2" />
        <line x1="55" y1="395" x2="80" y2="395" stroke="#f59e0b" strokeDasharray="2 2" />
        <line x1="55" y1="415" x2="80" y2="415" stroke="#f59e0b" strokeDasharray="2 2" />
        <text x="100" y="405" fill="#f5f5f5" fontSize="10" fontWeight="600">Tray Column</text>
      </g>

      {/* Column 1: Fluidized Bed */}
      <g
        onClick={() => onNodeClick("sym-fluidized-bed")}
        onMouseEnter={() => onNodeHover("sym-fluidized-bed")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer"
      >
        <rect x="50" y="470" width="35" height="95" rx="10" style={getStyle("sym-fluidized-bed")} />
        <circle cx="60" cy="520" r="1.5" fill="#f59e0b" />
        <circle cx="68" cy="510" r="1.5" fill="#f59e0b" />
        <circle cx="75" cy="525" r="1.5" fill="#f59e0b" />
        <text x="100" y="525" fill="#f5f5f5" fontSize="10" fontWeight="600">Fluidized Bed</text>
      </g>

      {/* Column 2: Structured Packing Column */}
      <g
        onClick={() => onNodeClick("sym-packing-col")}
        onMouseEnter={() => onNodeHover("sym-packing-col")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer"
      >
        <rect x="230" y="60" width="35" height="85" rx="8" style={getStyle("sym-packing-col")} />
        <line x1="230" y1="60" x2="265" y2="105" stroke="#10b981" strokeWidth="1" />
        <line x1="265" y1="60" x2="230" y2="105" stroke="#10b981" strokeWidth="1" />
        <text x="280" y="105" fill="#f5f5f5" fontSize="10" fontWeight="600">Packing Column</text>
      </g>

      {/* Column 2: Horizontal Drum */}
      <g
        onClick={() => onNodeClick("sym-drum")}
        onMouseEnter={() => onNodeHover("sym-drum")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer"
      >
        <rect x="220" y="180" width="60" height="30" rx="10" style={getStyle("sym-drum")} />
        <text x="290" y="200" fill="#f5f5f5" fontSize="10" fontWeight="600">Process Drum</text>
      </g>

      {/* Column 2: Knock-Out Drum */}
      <g
        onClick={() => onNodeClick("sym-ko-drum")}
        onMouseEnter={() => onNodeHover("sym-ko-drum")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer"
      >
        <rect x="230" y="245" width="38" height="75" rx="10" style={getStyle("sym-ko-drum")} />
        <line x1="230" y1="265" x2="268" y2="265" stroke="#38bdf8" strokeWidth="3" strokeDasharray="3 2" />
        <text x="280" y="290" fill="#f5f5f5" fontSize="10" fontWeight="600">KO Drum (Demister)</text>
      </g>

      {/* Column 3: Standard Boiler */}
      <g
        onClick={() => onNodeClick("sym-boiler")}
        onMouseEnter={() => onNodeHover("sym-boiler")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer"
      >
        <polygon points="430,75 445,60 455,60 470,75 470,120 430,120" style={getStyle("sym-boiler")} />
        <text x="485" y="95" fill="#f5f5f5" fontSize="10" fontWeight="600">Boiler</text>
      </g>

      {/* Column 3: Dome Boiler */}
      <g
        onClick={() => onNodeClick("sym-dome-boiler")}
        onMouseEnter={() => onNodeHover("sym-dome-boiler")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer"
      >
        <rect x="430" y="170" width="40" height="50" style={getStyle("sym-dome-boiler")} />
        <path d="M 440 170 A 10 10 0 0 1 460 170" fill="#737373" stroke="#f5f5f5" />
        <text x="485" y="200" fill="#f5f5f5" fontSize="10" fontWeight="600">Dome Boiler</text>
      </g>

      {/* Column 4: Floating Roof Tank */}
      <g
        onClick={() => onNodeClick("sym-float-roof")}
        onMouseEnter={() => onNodeHover("sym-float-roof")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer"
      >
        <rect x="630" y="70" width="50" height="40" style={getStyle("sym-float-roof")} />
        <line x1="630" y1="80" x2="680" y2="80" stroke="#f59e0b" strokeWidth="3" />
        <text x="690" y="95" fill="#f5f5f5" fontSize="10" fontWeight="600">Floating Roof Tank</text>
      </g>

      {/* Column 4: Cone Roof Tank */}
      <g
        onClick={() => onNodeClick("sym-cone-tank")}
        onMouseEnter={() => onNodeHover("sym-cone-tank")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer"
      >
        <polygon points="630,200 655,180 680,200 680,240 630,240" style={getStyle("sym-cone-tank")} />
        <text x="690" y="215" fill="#f5f5f5" fontSize="10" fontWeight="600">Cone Roof Tank</text>
      </g>

      {/* Column 4: Double Wall Tank */}
      <g
        onClick={() => onNodeClick("sym-double-wall")}
        onMouseEnter={() => onNodeHover("sym-double-wall")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer"
      >
        <rect x="630" y="290" width="50" height="40" style={getStyle("sym-double-wall")} />
        <rect x="635" y="295" width="40" height="30" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
        <text x="690" y="315" fill="#f5f5f5" fontSize="10" fontWeight="600">Double Wall Tank</text>
      </g>

      {/* Column 5: Heating/Cooling Jacket Vessel */}
      <g
        onClick={() => onNodeClick("sym-jacket-vessel")}
        onMouseEnter={() => onNodeHover("sym-jacket-vessel")}
        onMouseLeave={() => onNodeHover(null)}
        className="cursor-pointer"
      >
        <rect x="830" y="70" width="30" height="60" rx="8" style={getStyle("sym-jacket-vessel")} />
        {/* Annular jacket lines */}
        <line x1="823" y1="80" x2="823" y2="120" stroke="#f59e0b" strokeWidth="2.5" />
        <line x1="867" y1="80" x2="867" y2="120" stroke="#f59e0b" strokeWidth="2.5" />
        <text x="880" y="100" fill="#f5f5f5" fontSize="10" fontWeight="600">Jacket Vessel</text>
      </g>
    </svg>
  )
}
