#!/usr/bin/env python3
"""
Generate authentic, standard-compliant DEXPI P&ID vector SVGs using pyDEXPI.
Saves generated SVGs to frontend/public/dexpi/
"""

import os
import json
from pydexpi.dexpi_classes.graphics import (
    Diagram, RepresentationGroup, RepresentationTypeGroup,
    PolyLine, Polygon, Ellipse, Text, Point, Stroke, Color, DashStyle, FillStyle
)
from pydexpi.dexpi_classes.pydantic_classes import ProcessPlant, ProcessPlantParentStructure
from pydexpi.loaders.svg_loader import DrawDiagram

OUTPUT_DIR = "/home/johan/Hackathons/SIH2026/ai-harness/frontend/public/dexpi"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Standard DEXPI Colors
COLOR_PROCESS = Color(r=16, g=185, b=129)       # Emerald Green: Process hydrocarbon streams
COLOR_VAPOR = Color(r=56, g=189, b=248)         # Cyan: Overhead vapor streams
COLOR_HEAVY = Color(r=225, g=29, b=72)          # Crimson: Bottom residue / heavy streams
COLOR_SIGNAL = Color(r=245, g=158, b=11)        # Amber: Instrument & Electrical signals
COLOR_EQUIPMENT = Color(r=220, g=220, b=220)    # Light gray: Equipment shells
COLOR_BG = Color(r=23, g=23, b=23)              # Dark CAD background

STROKE_PROCESS = Stroke(color=COLOR_PROCESS, width=2.5, dashStyle=DashStyle.Solid)
STROKE_VAPOR = Stroke(color=COLOR_VAPOR, width=2.5, dashStyle=DashStyle.Solid)
STROKE_HEAVY = Stroke(color=COLOR_HEAVY, width=2.5, dashStyle=DashStyle.Solid)
STROKE_SIGNAL = Stroke(color=COLOR_SIGNAL, width=1.5, dashStyle=DashStyle.Dash)
STROKE_EQUIPMENT = Stroke(color=COLOR_EQUIPMENT, width=2.0, dashStyle=DashStyle.Solid)
STROKE_INTERNAL = Stroke(color=Color(r=115, g=115, b=115), width=1.2, dashStyle=DashStyle.Dash)


def build_c101_distillation_diagram() -> Diagram:
    """Atmospheric Distillation Unit C-101 DEXPI Diagram."""
    plant = ProcessPlant(id="plant-c101", parentStructure=ProcessPlantParentStructure(id="pps-c101", represents=None))
    elements = []
    
    # 1. Crude Surge Drum V-102 (Horizontal Vessel)
    elements.append(PolyLine(
        id="v102-shell",
        points=[Point(x=60, y=280), Point(x=140, y=280), Point(x=140, y=340), Point(x=60, y=340), Point(x=60, y=280)],
        stroke=STROKE_EQUIPMENT
    ))
    elements.append(PolyLine(id="v102-head-l", points=[Point(x=60, y=280), Point(x=45, y=310), Point(x=60, y=340)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="v102-head-r", points=[Point(x=140, y=280), Point(x=155, y=310), Point(x=140, y=340)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="v102-saddle1", points=[Point(x=75, y=340), Point(x=75, y=355)], stroke=STROKE_INTERNAL))
    elements.append(PolyLine(id="v102-saddle2", points=[Point(x=125, y=340), Point(x=125, y=355)], stroke=STROKE_INTERNAL))

    # 2. Main Feed Booster Pump P-101A (Centrifugal Pump)
    elements.append(Ellipse(
        id="p101a-casing",
        center=Point(x=240, y=420),
        horizontalSemiAxis=20,
        verticalSemiAxis=20,
        rotation=0.0,
        fillStyle=FillStyle.Transparent,
        stroke=STROKE_EQUIPMENT
    ))
    elements.append(PolyLine(id="p101a-tangent", points=[Point(x=240, y=400), Point(x=260, y=400), Point(x=260, y=420)], stroke=STROKE_EQUIPMENT))

    # 3. Control Valve FCV-101 (Pneumatic Actuated Valve)
    elements.append(Polygon(id="fcv101-body1", points=[Point(x=350, y=410), Point(x=370, y=420), Point(x=350, y=430)], fillStyle=FillStyle.Transparent, stroke=STROKE_EQUIPMENT))
    elements.append(Polygon(id="fcv101-body2", points=[Point(x=370, y=420), Point(x=390, y=410), Point(x=390, y=430)], fillStyle=FillStyle.Transparent, stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="fcv101-stem", points=[Point(x=370, y=410), Point(x=370, y=390)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="fcv101-dome", points=[Point(x=355, y=390), Point(x=370, y=378), Point(x=385, y=390), Point(x=355, y=390)], stroke=STROKE_EQUIPMENT))

    # 4. Pressure Transmitter PT-301 (ISA-5.1 Instrument Bubble)
    elements.append(Ellipse(
        id="pt301-bubble",
        center=Point(x=300, y=340),
        horizontalSemiAxis=16,
        verticalSemiAxis=16,
        rotation=0.0,
        fillStyle=FillStyle.Transparent,
        stroke=STROKE_SIGNAL
    ))
    elements.append(PolyLine(id="pt301-line", points=[Point(x=284, y=340), Point(x=316, y=340)], stroke=STROKE_SIGNAL))

    # 5. Distillation Column C-101 (36 Trays Fractionation Tower)
    elements.append(PolyLine(
        id="c101-shell",
        points=[
            Point(x=480, y=80), Point(x=600, y=80),
            Point(x=600, y=500), Point(x=480, y=500),
            Point(x=480, y=80)
        ],
        stroke=STROKE_EQUIPMENT
    ))
    elements.append(PolyLine(id="c101-top-head", points=[Point(x=480, y=80), Point(x=540, y=55), Point(x=600, y=80)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="c101-btm-head", points=[Point(x=480, y=500), Point(x=540, y=525), Point(x=600, y=500)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="c101-skirt", points=[Point(x=490, y=520), Point(x=480, y=550), Point(x=600, y=550), Point(x=590, y=520)], stroke=STROKE_INTERNAL))

    for tray_y in range(110, 480, 24):
        elements.append(PolyLine(
            id=f"c101-tray-{tray_y}",
            points=[Point(x=490, y=tray_y), Point(x=590, y=tray_y)],
            stroke=STROKE_INTERNAL
        ))

    # Flash Zone Nozzle
    elements.append(PolyLine(id="c101-flash-zone", points=[Point(x=480, y=320), Point(x=450, y=320)], stroke=STROKE_PROCESS))

    # 6. Overhead Condenser E-101 (Shell & Tube Heat Exchanger)
    elements.append(Ellipse(
        id="e101-shell",
        center=Point(x=750, y=130),
        horizontalSemiAxis=30,
        verticalSemiAxis=30,
        rotation=0.0,
        fillStyle=FillStyle.Transparent,
        stroke=STROKE_EQUIPMENT
    ))
    elements.append(PolyLine(
        id="e101-tube",
        points=[Point(x=730, y=120), Point(x=745, y=140), Point(x=755, y=120), Point(x=770, y=140)],
        stroke=STROKE_VAPOR
    ))

    # 7. Overhead Reflux Drum V-103
    elements.append(PolyLine(
        id="v103-shell",
        points=[Point(x=820, y=180), Point(x=920, y=180), Point(x=920, y=240), Point(x=820, y=240), Point(x=820, y=180)],
        stroke=STROKE_EQUIPMENT
    ))
    elements.append(PolyLine(id="v103-head-l", points=[Point(x=820, y=180), Point(x=808, y=210), Point(x=820, y=240)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="v103-head-r", points=[Point(x=920, y=180), Point(x=932, y=210), Point(x=920, y=240)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(
        id="v103-boot",
        points=[Point(x=885, y=240), Point(x=885, y=265), Point(x=905, y=265), Point(x=905, y=240)],
        stroke=STROKE_EQUIPMENT
    ))

    # 8. Reflux Pump P-102
    elements.append(Ellipse(
        id="p102-casing",
        center=Point(x=820, y=380),
        horizontalSemiAxis=18,
        verticalSemiAxis=18,
        rotation=0.0,
        fillStyle=FillStyle.Transparent,
        stroke=STROKE_EQUIPMENT
    ))

    # 9. Reflux Valve FCV-102
    elements.append(Polygon(id="fcv102-body1", points=[Point(x=700, y=230), Point(x=716, y=240), Point(x=700, y=250)], fillStyle=FillStyle.Transparent, stroke=STROKE_EQUIPMENT))
    elements.append(Polygon(id="fcv102-body2", points=[Point(x=716, y=240), Point(x=732, y=230), Point(x=732, y=250)], fillStyle=FillStyle.Transparent, stroke=STROKE_EQUIPMENT))

    # --- PROCESS PIPELINES ---
    elements.append(PolyLine(id="pipe-feed-in", points=[Point(x=10, y=310), Point(x=45, y=310)], stroke=STROKE_PROCESS))
    elements.append(PolyLine(id="pipe-v102-p101a", points=[Point(x=100, y=340), Point(x=100, y=420), Point(x=220, y=420)], stroke=STROKE_PROCESS))
    elements.append(PolyLine(id="pipe-p101-fcv101", points=[Point(x=260, y=420), Point(x=350, y=420)], stroke=STROKE_PROCESS))
    elements.append(PolyLine(id="pipe-fcv101-c101", points=[Point(x=390, y=420), Point(x=420, y=420), Point(x=420, y=320), Point(x=480, y=320)], stroke=STROKE_PROCESS))
    elements.append(PolyLine(id="pipe-pt301-wire", points=[Point(x=300, y=420), Point(x=300, y=356)], stroke=STROKE_SIGNAL))
    elements.append(PolyLine(id="pipe-ovhd-vapor", points=[Point(x=540, y=55), Point(x=540, y=35), Point(x=750, y=35), Point(x=750, y=100)], stroke=STROKE_VAPOR))
    elements.append(PolyLine(id="pipe-e101-v103", points=[Point(x=750, y=160), Point(x=750, y=210), Point(x=808, y=210)], stroke=STROKE_VAPOR))
    elements.append(PolyLine(id="pipe-v103-p102", points=[Point(x=870, y=240), Point(x=870, y=380), Point(x=838, y=380)], stroke=STROKE_PROCESS))
    elements.append(PolyLine(id="pipe-p102-fcv102", points=[Point(x=802, y=380), Point(x=716, y=380), Point(x=716, y=250)], stroke=STROKE_PROCESS))
    elements.append(PolyLine(id="pipe-fcv102-c101", points=[Point(x=716, y=230), Point(x=716, y=130), Point(x=600, y=130)], stroke=STROKE_PROCESS))
    elements.append(PolyLine(id="pipe-c101-bottoms", points=[Point(x=540, y=525), Point(x=540, y=570), Point(x=660, y=570)], stroke=STROKE_HEAVY))

    type_grp = RepresentationTypeGroup(id="rtg-c101", elements=elements)
    grp = RepresentationGroup(id="grp-c101", represents=plant, groups=[type_grp])

    return Diagram(
        id="DWG-C101-ADU",
        name="Atmospheric Crude Distillation Unit (Column C-101)",
        minX=0,
        minY=0,
        maxX=1000,
        maxY=600,
        represents=plant,
        backgroundColor=COLOR_BG,
        groups=[grp]
    )


def build_hds201_reactor_diagram() -> Diagram:
    """Diesel Hydrodesulfurization (DHDS) Reactor Loop Diagram."""
    plant = ProcessPlant(id="plant-hds201", parentStructure=ProcessPlantParentStructure(id="pps-hds201", represents=None))
    elements = []

    # 1. Fired Heater Furnace H-201
    elements.append(PolyLine(
        id="h201-cabin",
        points=[
            Point(x=90, y=240), Point(x=130, y=180), Point(x=190, y=180), Point(x=230, y=240),
            Point(x=230, y=400), Point(x=90, y=400), Point(x=90, y=240)
        ],
        stroke=STROKE_EQUIPMENT
    ))
    elements.append(PolyLine(
        id="h201-coil",
        points=[
            Point(x=110, y=260), Point(x=210, y=260), Point(x=210, y=290), Point(x=110, y=290),
            Point(x=110, y=320), Point(x=210, y=320), Point(x=210, y=350), Point(x=110, y=350)
        ],
        stroke=STROKE_SIGNAL
    ))

    # 2. Catalytic Reactor R-201
    elements.append(PolyLine(
        id="r201-shell",
        points=[Point(x=380, y=100), Point(x=480, y=100), Point(x=480, y=460), Point(x=380, y=460), Point(x=380, y=100)],
        stroke=STROKE_EQUIPMENT
    ))
    elements.append(PolyLine(id="r201-head-t", points=[Point(x=380, y=100), Point(x=430, y=70), Point(x=480, y=100)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="r201-head-b", points=[Point(x=380, y=460), Point(x=430, y=490), Point(x=480, y=460)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="r201-bed1-t", points=[Point(x=390, y=150), Point(x=470, y=150)], stroke=STROKE_INTERNAL))
    elements.append(PolyLine(id="r201-bed1-b", points=[Point(x=390, y=270), Point(x=470, y=270)], stroke=STROKE_INTERNAL))
    elements.append(PolyLine(id="r201-bed2-t", points=[Point(x=390, y=320), Point(x=470, y=320)], stroke=STROKE_INTERNAL))
    elements.append(PolyLine(id="r201-bed2-b", points=[Point(x=390, y=430), Point(x=470, y=430)], stroke=STROKE_INTERNAL))

    # 3. Emergency Depressuring Blowdown Valve BDV-201
    elements.append(Polygon(id="bdv201-v1", points=[Point(x=420, y=40), Point(x=435, y=50), Point(x=420, y=60)], fillStyle=FillStyle.Transparent, stroke=STROKE_HEAVY))
    elements.append(Polygon(id="bdv201-v2", points=[Point(x=450, y=40), Point(x=435, y=50), Point(x=450, y=60)], fillStyle=FillStyle.Transparent, stroke=STROKE_HEAVY))

    # 4. Feed/Effluent Exchanger E-201
    elements.append(Ellipse(
        id="e201-shell",
        center=Point(x=600, y=340),
        horizontalSemiAxis=32,
        verticalSemiAxis=32,
        rotation=0.0,
        fillStyle=FillStyle.Transparent,
        stroke=STROKE_EQUIPMENT
    ))

    # 5. High Pressure Separator V-201
    elements.append(PolyLine(
        id="v201-shell",
        points=[Point(x=720, y=180), Point(x=800, y=180), Point(x=800, y=420), Point(x=720, y=420), Point(x=720, y=180)],
        stroke=STROKE_EQUIPMENT
    ))
    elements.append(PolyLine(id="v201-head-t", points=[Point(x=720, y=180), Point(x=760, y=160), Point(x=800, y=180)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="v201-head-b", points=[Point(x=720, y=420), Point(x=760, y=440), Point(x=800, y=420)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="v201-demister", points=[Point(x=725, y=220), Point(x=795, y=220)], stroke=STROKE_INTERNAL))

    # 6. Hydrogen Recycle Gas Compressor K-201
    elements.append(Polygon(
        id="k201-casing",
        points=[Point(x=860, y=100), Point(x=930, y=115), Point(x=930, y=145), Point(x=860, y=160)],
        fillStyle=FillStyle.Transparent,
        stroke=STROKE_EQUIPMENT
    ))

    # Piping
    elements.append(PolyLine(id="hds-feed-in", points=[Point(x=30, y=350), Point(x=110, y=350)], stroke=STROKE_PROCESS))
    elements.append(PolyLine(id="hds-h201-r201", points=[Point(x=110, y=260), Point(x=60, y=260), Point(x=60, y=70), Point(x=430, y=70)], stroke=STROKE_PROCESS))
    elements.append(PolyLine(id="hds-bdv201-flare", points=[Point(x=435, y=40), Point(x=435, y=20), Point(x=520, y=20)], stroke=STROKE_HEAVY))
    elements.append(PolyLine(id="hds-r201-e201", points=[Point(x=430, y=490), Point(x=430, y=530), Point(x=600, y=530), Point(x=600, y=372)], stroke=STROKE_PROCESS))
    elements.append(PolyLine(id="hds-e201-v201", points=[Point(x=600, y=308), Point(x=600, y=280), Point(x=720, y=280)], stroke=STROKE_PROCESS))
    elements.append(PolyLine(id="hds-v201-k201", points=[Point(x=760, y=160), Point(x=760, y=130), Point(x=860, y=130)], stroke=STROKE_VAPOR))
    elements.append(PolyLine(id="hds-recycle-return", points=[Point(x=930, y=130), Point(x=970, y=130), Point(x=970, y=570), Point(x=40, y=570), Point(x=40, y=350)], stroke=STROKE_VAPOR))

    type_grp = RepresentationTypeGroup(id="rtg-hds", elements=elements)
    grp = RepresentationGroup(id="grp-hds", represents=plant, groups=[type_grp])

    return Diagram(
        id="DWG-HDS-201",
        name="Diesel Hydrodesulfurization (DHDS) Reactor Loop",
        minX=0,
        minY=0,
        maxX=1000,
        maxY=600,
        represents=plant,
        backgroundColor=COLOR_BG,
        groups=[grp]
    )

def build_ovhd105_diagram() -> Diagram:
    """Crude Overhead Condenser & Naphtha Stabilizer DEXPI Diagram."""
    plant = ProcessPlant(id="plant-ovhd105", parentStructure=ProcessPlantParentStructure(id="pps-ovhd105", represents=None))
    elements = []

    # 1. Fin-Fan Air Coolers E-105A-D
    elements.append(PolyLine(
        id="e105-frame",
        points=[Point(x=120, y=140), Point(x=280, y=140), Point(x=280, y=240), Point(x=120, y=240), Point(x=120, y=140)],
        stroke=STROKE_EQUIPMENT
    ))
    # Fan rotors
    elements.append(Ellipse(id="e105-fan1", center=Point(x=165, y=190), horizontalSemiAxis=18, verticalSemiAxis=18, rotation=0.0, fillStyle=FillStyle.Transparent, stroke=STROKE_INTERNAL))
    elements.append(Ellipse(id="e105-fan2", center=Point(x=235, y=190), horizontalSemiAxis=18, verticalSemiAxis=18, rotation=0.0, fillStyle=FillStyle.Transparent, stroke=STROKE_INTERNAL))

    # 2. Overhead Accumulator V-103
    elements.append(PolyLine(
        id="v103-shell",
        points=[Point(x=360, y=240), Point(x=520, y=240), Point(x=520, y=340), Point(x=360, y=340), Point(x=360, y=240)],
        stroke=STROKE_EQUIPMENT
    ))
    elements.append(PolyLine(id="v103-head-l", points=[Point(x=360, y=240), Point(x=340, y=290), Point(x=360, y=340)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="v103-head-r", points=[Point(x=520, y=240), Point(x=540, y=290), Point(x=520, y=340)], stroke=STROKE_EQUIPMENT))
    # Sour Water Boot
    elements.append(PolyLine(
        id="v103-boot",
        points=[Point(x=475, y=340), Point(x=475, y=380), Point(x=510, y=380), Point(x=510, y=340)],
        stroke=STROKE_EQUIPMENT
    ))

    # 3. Off-Gas Pressure Control Valve PCV-105
    elements.append(Polygon(id="pcv105-b1", points=[Point(x=495, y=120), Point(x=515, y=130), Point(x=495, y=140)], fillStyle=FillStyle.Transparent, stroke=STROKE_EQUIPMENT))
    elements.append(Polygon(id="pcv105-b2", points=[Point(x=515, y=130), Point(x=535, y=120), Point(x=535, y=140)], fillStyle=FillStyle.Transparent, stroke=STROKE_EQUIPMENT))

    # 4. Reflux Pump P-103A
    elements.append(Ellipse(id="p103a-casing", center=Point(x=640, y=440), horizontalSemiAxis=20, verticalSemiAxis=20, rotation=0.0, fillStyle=FillStyle.Transparent, stroke=STROKE_EQUIPMENT))

    # 5. Product Forwarding Pump P-103B
    elements.append(Ellipse(id="p103b-casing", center=Point(x=780, y=500), horizontalSemiAxis=20, verticalSemiAxis=20, rotation=0.0, fillStyle=FillStyle.Transparent, stroke=STROKE_EQUIPMENT))

    # Piping
    elements.append(PolyLine(id="ovhd-inlet", points=[Point(x=20, y=190), Point(x=120, y=190)], stroke=STROKE_VAPOR))
    elements.append(PolyLine(id="ovhd-e105-v103", points=[Point(x=280, y=190), Point(x=420, y=190), Point(x=420, y=240)], stroke=STROKE_VAPOR))
    elements.append(PolyLine(id="ovhd-offgas", points=[Point(x=450, y=240), Point(x=450, y=130), Point(x=495, y=130)], stroke=STROKE_SIGNAL))
    elements.append(PolyLine(id="ovhd-v103-p103a", points=[Point(x=490, y=340), Point(x=490, y=440), Point(x=620, y=440)], stroke=STROKE_PROCESS))
    elements.append(PolyLine(id="ovhd-v103-p103b", points=[Point(x=550, y=440), Point(x=550, y=500), Point(x=760, y=500)], stroke=STROKE_PROCESS))

    type_grp = RepresentationTypeGroup(id="rtg-ovhd", elements=elements)
    grp = RepresentationGroup(id="grp-ovhd", represents=plant, groups=[type_grp])

    return Diagram(
        id="DWG-OVHD-105",
        name="Crude Overhead Condenser & Naphtha Stabilizer",
        minX=0,
        minY=0,
        maxX=1000,
        maxY=600,
        represents=plant,
        backgroundColor=COLOR_BG,
        groups=[grp]
    )


def build_isa_symbology_diagram() -> Diagram:
    """ISA-5.1 / ISO 10628 Standard Equipment & Symbology Reference."""
    plant = ProcessPlant(id="plant-isa", parentStructure=ProcessPlantParentStructure(id="pps-isa", represents=None))
    elements = []

    # Column 1: Vertical Vessel
    elements.append(PolyLine(id="sym-vv", points=[Point(x=50, y=60), Point(x=85, y=60), Point(x=85, y=130), Point(x=50, y=130), Point(x=50, y=60)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="sym-vv-t", points=[Point(x=50, y=60), Point(x=67, y=48), Point(x=85, y=60)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="sym-vv-b", points=[Point(x=50, y=130), Point(x=67, y=142), Point(x=85, y=130)], stroke=STROKE_EQUIPMENT))

    # Column 1: Mixing Vessel with Agitator
    elements.append(PolyLine(id="sym-mv", points=[Point(x=50, y=170), Point(x=85, y=170), Point(x=85, y=220), Point(x=50, y=220), Point(x=50, y=170)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="sym-mv-shaft", points=[Point(x=67, y=150), Point(x=67, y=200)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="sym-mv-blade", points=[Point(x=58, y=200), Point(x=76, y=200)], stroke=STROKE_EQUIPMENT))

    # Column 1: Tray Column
    elements.append(PolyLine(id="sym-tc", points=[Point(x=50, y=260), Point(x=85, y=260), Point(x=85, y=360), Point(x=50, y=360), Point(x=50, y=260)], stroke=STROKE_EQUIPMENT))
    for ty in [285, 310, 335]:
        elements.append(PolyLine(id=f"sym-tc-t-{ty}", points=[Point(x=55, y=ty), Point(x=80, y=ty)], stroke=STROKE_INTERNAL))

    # Column 2: Structured Packing Column
    elements.append(PolyLine(id="sym-pc", points=[Point(x=230, y=60), Point(x=265, y=60), Point(x=265, y=145), Point(x=230, y=145), Point(x=230, y=60)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="sym-pc-x1", points=[Point(x=230, y=60), Point(x=265, y=105)], stroke=STROKE_INTERNAL))
    elements.append(PolyLine(id="sym-pc-x2", points=[Point(x=265, y=60), Point(x=230, y=105)], stroke=STROKE_INTERNAL))

    # Column 2: Knock-Out Drum with Demister
    elements.append(PolyLine(id="sym-ko", points=[Point(x=230, y=180), Point(x=268, y=180), Point(x=268, y=260), Point(x=230, y=260), Point(x=230, y=180)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="sym-ko-mesh", points=[Point(x=232, y=205), Point(x=266, y=205)], stroke=STROKE_VAPOR))

    # Column 3: Industrial Boiler
    elements.append(PolyLine(
        id="sym-blr",
        points=[Point(x=430, y=75), Point(x=445, y=60), Point(x=455, y=60), Point(x=470, y=75), Point(x=470, y=120), Point(x=430, y=120), Point(x=430, y=75)],
        stroke=STROKE_EQUIPMENT
    ))

    # Column 4: Floating Roof Tank
    elements.append(PolyLine(id="sym-frt", points=[Point(x=630, y=70), Point(x=680, y=70), Point(x=680, y=110), Point(x=630, y=110), Point(x=630, y=70)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="sym-frt-roof", points=[Point(x=630, y=80), Point(x=680, y=80)], stroke=STROKE_SIGNAL))

    # Column 4: Cone Roof Tank
    elements.append(PolyLine(id="sym-crt-roof", points=[Point(x=630, y=180), Point(x=655, y=160), Point(x=680, y=180)], stroke=STROKE_EQUIPMENT))
    elements.append(PolyLine(id="sym-crt-body", points=[Point(x=630, y=180), Point(x=680, y=180), Point(x=680, y=220), Point(x=630, y=220), Point(x=630, y=180)], stroke=STROKE_EQUIPMENT))

    type_grp = RepresentationTypeGroup(id="rtg-isa", elements=elements)
    grp = RepresentationGroup(id="grp-isa", represents=plant, groups=[type_grp])

    return Diagram(
        id="DWG-ISA-SYM",
        name="ISA-5.1 / ISO 10628 Standard Equipment & Symbology",
        minX=0,
        minY=0,
        maxX=1000,
        maxY=600,
        represents=plant,
        backgroundColor=COLOR_BG,
        groups=[grp]
    )


def main():
    print("Generating official pyDEXPI standard P&ID vector SVGs with transparent background and margin padding...")
    
    diagrams = [
        build_c101_distillation_diagram(),
        build_hds201_reactor_diagram(),
        build_ovhd105_diagram(),
        build_isa_symbology_diagram(),
    ]
    
    for diag in diagrams:
        # Generates with 40px padding so no lines/equipment are cut at the borders
        drawer = DrawDiagram(diag, padding=40.0)
        # background=False completely removes the opaque background rectangle
        svg_content = drawer.draw_svg(background=False)
        
        # Ensure clean transparent presentation
        svg_content = svg_content.replace('fill="rgb(23,23,23)"', 'fill="none"')
        svg_content = svg_content.replace('fill="rgb(0,0,0)"', 'fill="none"')
        
        filename = f"{diag.id}.svg"
        out_path = os.path.join(OUTPUT_DIR, filename)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(svg_content)
        print(f"Saved: {out_path} ({len(svg_content)} bytes)")

    print("All pyDEXPI SVGs generated successfully with transparent backgrounds & zero clipping!")


if __name__ == "__main__":
    main()


