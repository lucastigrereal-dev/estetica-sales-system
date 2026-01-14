"""
Serviço de Geração de Relatórios

Gera relatórios em PDF e Excel com dados de agendamentos, pacientes e financeiro.
"""

from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import date, datetime, timedelta
from typing import Optional
import io
import xlsxwriter
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from .. import models


class RelatorioService:
    """Serviço para geração de relatórios"""

    def __init__(self, db: Session, clinica_id: int):
        self.db = db
        self.clinica_id = clinica_id

    async def gerar_relatorio_mensal_pdf(self, mes: int, ano: int, nome_clinica: str) -> io.BytesIO:
        """Gera relatório mensal completo em PDF"""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        story = []
        styles = getSampleStyleSheet()

        # Título
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#2C3E50'),
            spaceAfter=30,
            alignment=TA_CENTER
        )

        story.append(Paragraph(f"Relatório Mensal - {nome_clinica}", title_style))
        story.append(Paragraph(f"{mes:02d}/{ano}", styles['Heading2']))
        story.append(Spacer(1, 20))

        # Período
        data_inicio = date(ano, mes, 1)
        if mes == 12:
            data_fim = date(ano + 1, 1, 1) - timedelta(days=1)
        else:
            data_fim = date(ano, mes + 1, 1) - timedelta(days=1)

        # Seção 1: Resumo Financeiro
        story.append(Paragraph("1. Resumo Financeiro", styles['Heading2']))
        story.append(Spacer(1, 12))

        receita_total = self.db.query(func.sum(models.Pagamento.valor_final)).filter(
            models.Pagamento.clinica_id == self.clinica_id,
            models.Pagamento.status == "APROVADO",
            models.Pagamento.data_pagamento >= data_inicio,
            models.Pagamento.data_pagamento <= data_fim
        ).scalar() or 0.0

        pagamentos_count = self.db.query(models.Pagamento).filter(
            models.Pagamento.clinica_id == self.clinica_id,
            models.Pagamento.status == "APROVADO",
            models.Pagamento.data_pagamento >= data_inicio,
            models.Pagamento.data_pagamento <= data_fim
        ).count()

        financial_data = [
            ['Métrica', 'Valor'],
            ['Receita Total', f'R$ {receita_total:,.2f}'],
            ['Pagamentos Recebidos', str(pagamentos_count)],
            ['Ticket Médio', f'R$ {(receita_total / pagamentos_count if pagamentos_count > 0 else 0):,.2f}']
        ]

        table = Table(financial_data, colWidths=[3*inch, 2*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3498DB')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))

        story.append(table)
        story.append(Spacer(1, 20))

        # Seção 2: Agendamentos
        story.append(Paragraph("2. Agendamentos", styles['Heading2']))
        story.append(Spacer(1, 12))

        agendamentos = self.db.query(models.Agendamento).filter(
            models.Agendamento.clinica_id == self.clinica_id,
            models.Agendamento.data >= data_inicio,
            models.Agendamento.data <= data_fim
        ).all()

        agendamentos_total = len(agendamentos)
        realizados = len([a for a in agendamentos if a.status == "realizado"])
        cancelados = len([a for a in agendamentos if a.status == "cancelado"])

        agend_data = [
            ['Status', 'Quantidade', 'Percentual'],
            ['Total', str(agendamentos_total), '100%'],
            ['Realizados', str(realizados), f'{(realizados/agendamentos_total*100 if agendamentos_total > 0 else 0):.1f}%'],
            ['Cancelados', str(cancelados), f'{(cancelados/agendamentos_total*100 if agendamentos_total > 0 else 0):.1f}%']
        ]

        table2 = Table(agend_data, colWidths=[2*inch, 1.5*inch, 1.5*inch])
        table2.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2ECC71')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.lightgreen),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))

        story.append(table2)
        story.append(Spacer(1, 20))

        # Seção 3: Top Procedimentos
        story.append(Paragraph("3. Top Procedimentos", styles['Heading2']))
        story.append(Spacer(1, 12))

        top_proc = self.db.query(
            models.Procedimento.nome,
            func.count(models.Agendamento.id).label('quantidade')
        ).join(
            models.Agendamento, models.Procedimento.id == models.Agendamento.procedimento_id
        ).filter(
            models.Agendamento.clinica_id == self.clinica_id,
            models.Agendamento.data >= data_inicio,
            models.Agendamento.data <= data_fim
        ).group_by(
            models.Procedimento.nome
        ).order_by(
            func.count(models.Agendamento.id).desc()
        ).limit(5).all()

        proc_data = [['Procedimento', 'Quantidade']]
        for proc in top_proc:
            proc_data.append([proc.nome, str(proc.quantidade)])

        if len(proc_data) > 1:
            table3 = Table(proc_data, colWidths=[3*inch, 2*inch])
            table3.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#E74C3C')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('ALIGN', (1, 0), (1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.lightcoral),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            story.append(table3)

        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer

    async def exportar_agendamentos_excel(
        self,
        data_inicio: Optional[date] = None,
        data_fim: Optional[date] = None,
        status: Optional[str] = None
    ) -> io.BytesIO:
        """Exporta agendamentos para Excel"""
        buffer = io.BytesIO()
        workbook = xlsxwriter.Workbook(buffer)
        worksheet = workbook.add_worksheet("Agendamentos")

        # Formatos
        header_format = workbook.add_format({
            'bold': True,
            'bg_color': '#3498DB',
            'font_color': 'white',
            'border': 1
        })

        # Headers
        headers = ['ID', 'Data', 'Paciente', 'Procedimento', 'Profissional', 'Status', 'Confirmado']
        for col, header in enumerate(headers):
            worksheet.write(0, col, header, header_format)

        # Query
        query = self.db.query(models.Agendamento).filter(
            models.Agendamento.clinica_id == self.clinica_id
        )

        if data_inicio:
            query = query.filter(models.Agendamento.data >= data_inicio)
        if data_fim:
            query = query.filter(models.Agendamento.data <= data_fim)
        if status:
            query = query.filter(models.Agendamento.status == status)

        agendamentos = query.all()

        # Dados
        for row, agend in enumerate(agendamentos, start=1):
            worksheet.write(row, 0, agend.id)
            worksheet.write(row, 1, agend.data.strftime('%d/%m/%Y %H:%M'))
            worksheet.write(row, 2, agend.paciente.nome if agend.paciente else '')
            worksheet.write(row, 3, agend.procedimento.nome if agend.procedimento else '')
            worksheet.write(row, 4, agend.profissional or '')
            worksheet.write(row, 5, agend.status)
            worksheet.write(row, 6, 'Sim' if agend.confirmado else 'Não')

        # Ajustar larguras
        worksheet.set_column(0, 0, 10)
        worksheet.set_column(1, 1, 18)
        worksheet.set_column(2, 3, 25)
        worksheet.set_column(4, 6, 15)

        workbook.close()
        buffer.seek(0)
        return buffer

    async def exportar_pacientes_excel(self, nome: Optional[str] = None) -> io.BytesIO:
        """Exporta pacientes para Excel"""
        buffer = io.BytesIO()
        workbook = xlsxwriter.Workbook(buffer)
        worksheet = workbook.add_worksheet("Pacientes")

        header_format = workbook.add_format({
            'bold': True,
            'bg_color': '#2ECC71',
            'font_color': 'white',
            'border': 1
        })

        headers = ['ID', 'Nome', 'Telefone', 'Email', 'Data Cadastro']
        for col, header in enumerate(headers):
            worksheet.write(0, col, header, header_format)

        query = self.db.query(models.Paciente).filter(
            models.Paciente.clinica_id == self.clinica_id
        )

        if nome:
            query = query.filter(models.Paciente.nome.contains(nome))

        pacientes = query.all()

        for row, pac in enumerate(pacientes, start=1):
            worksheet.write(row, 0, pac.id)
            worksheet.write(row, 1, pac.nome)
            worksheet.write(row, 2, pac.telefone)
            worksheet.write(row, 3, pac.email or '')
            worksheet.write(row, 4, pac.created_at.strftime('%d/%m/%Y'))

        worksheet.set_column(0, 0, 10)
        worksheet.set_column(1, 1, 30)
        worksheet.set_column(2, 4, 20)

        workbook.close()
        buffer.seek(0)
        return buffer

    async def exportar_financeiro_excel(
        self,
        data_inicio: Optional[date] = None,
        data_fim: Optional[date] = None,
        status: Optional[str] = None,
        metodo: Optional[str] = None
    ) -> io.BytesIO:
        """Exporta dados financeiros para Excel"""
        buffer = io.BytesIO()
        workbook = xlsxwriter.Workbook(buffer)
        worksheet = workbook.add_worksheet("Financeiro")

        header_format = workbook.add_format({
            'bold': True,
            'bg_color': '#E74C3C',
            'font_color': 'white',
            'border': 1
        })

        money_format = workbook.add_format({'num_format': 'R$ #,##0.00'})

        headers = ['ID', 'Data', 'Paciente', 'Valor', 'Desconto', 'Valor Final', 'Método', 'Status', 'Data Pagamento']
        for col, header in enumerate(headers):
            worksheet.write(0, col, header, header_format)

        query = self.db.query(models.Pagamento).filter(
            models.Pagamento.clinica_id == self.clinica_id
        )

        if data_inicio:
            query = query.filter(models.Pagamento.created_at >= data_inicio)
        if data_fim:
            query = query.filter(models.Pagamento.created_at <= data_fim)
        if status:
            query = query.filter(models.Pagamento.status == status)
        if metodo:
            query = query.filter(models.Pagamento.metodo == metodo)

        pagamentos = query.all()

        for row, pag in enumerate(pagamentos, start=1):
            worksheet.write(row, 0, pag.id)
            worksheet.write(row, 1, pag.created_at.strftime('%d/%m/%Y'))
            worksheet.write(row, 2, pag.paciente.nome if pag.paciente else '')
            worksheet.write(row, 3, pag.valor, money_format)
            worksheet.write(row, 4, pag.desconto, money_format)
            worksheet.write(row, 5, pag.valor_final, money_format)
            worksheet.write(row, 6, pag.metodo)
            worksheet.write(row, 7, pag.status)
            worksheet.write(row, 8, pag.data_pagamento.strftime('%d/%m/%Y') if pag.data_pagamento else '')

        worksheet.set_column(0, 0, 10)
        worksheet.set_column(1, 1, 15)
        worksheet.set_column(2, 2, 30)
        worksheet.set_column(3, 5, 15)
        worksheet.set_column(6, 8, 15)

        workbook.close()
        buffer.seek(0)
        return buffer
