"use client"

import { useEffect, useState, useRef } from "react"
import type { TournamentFormat } from "../types/tournament"
import ActionToolbar from "../components/ui-elements/ActionToolbar"
import { FileDown } from "lucide-react"
import { FinalResultSection } from "@/components/leaderBoard/FinalResultSection"
import { LeaderboardTable } from "@/components/leaderBoard/LeaderboardTable/LeaderboardTable"
import { useParams } from "next/navigation"
import { LeaderboardRecord } from "@/types/leaderboard"
import api, { getTournamentById } from "@/apis/api"
import { convertLeaderboardRecord } from "@/utils/leaderboard"
import jsPDF from 'jspdf'


export default function Leaderboard() {
  const [loading, setIsLoading] = useState<boolean>(false)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardRecord | null>(null)
  const params = useParams()
  const tournamentId = params?.id as string
  const leaderboardRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)


const getAll = async (tournamentId: number) => {


    const leaderboardResponse = await api.get(`/tournament/${tournamentId}/leaderboard`)

    if (leaderboardResponse.data.data) {
      const convertedData = convertLeaderboardRecord(leaderboardResponse.data.data)
      setLeaderboardData(convertedData)
      setIsLoading(true)
    } else {
      setLeaderboardData({ leaderBoard: [], matches: [], started: false, teamsTop1: [], teamsTop2: [], teamsTop3: [] })
    }

}

useEffect(() => {
  const fetchLeaderboardData = async () => {
    getAll(Number(tournamentId))
    const tournament= await getTournamentById(Number(tournamentId))
    setFormat(tournament.data.format)
    
  }
  if (tournamentId) {
    fetchLeaderboardData()
  }
}, [tournamentId])
  const [format, setFormat] = useState<TournamentFormat>("ROUND_ROBIN")
  const [selectedGroup, setSelectedGroup] = useState<string>("A")
  
  const groupedStandings = leaderboardData?.leaderBoard
    ? [...new Set(leaderboardData.leaderBoard.map(team => team.group))].sort()
    : []
  const handleExportLeaderboard = () => {
    if (!leaderboardData || !leaderboardData.leaderBoard || leaderboardData.leaderBoard.length === 0) {
      alert('No leaderboard data to export');
      return;
    }

    try {
      // Get the data to display
      const dataToExport = format === 'GROUP_STAGE' 
        ? leaderboardData.leaderBoard.filter(team => team.group === selectedGroup)
        : leaderboardData.leaderBoard;

      // Create PDF with jsPDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPos = margin;
      
      // Add title
      pdf.setFontSize(18);
      pdf.setTextColor(53, 98, 166); // #3562A6
      const title = `Tournament Leaderboard${format === 'GROUP_STAGE' ? ` - Group ${selectedGroup}` : ''}`;
      pdf.text(title, pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;
      
      // Add top 3 teams section
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Top 3 Teams', pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;
      
      // Draw podium
      const podiumWidth = 120;
      const podiumX = (pageWidth - podiumWidth) / 2;
      
      // First place (center, tallest)
      if (dataToExport.length > 0) {
        pdf.setFillColor(255, 231, 45); // #ffe72d
        pdf.rect(podiumX + 40, yPos, 40, 30, 'F');
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);
        pdf.text('1', podiumX + 60, yPos + 10, { align: 'center' });
        pdf.setFontSize(10);
        pdf.text(dataToExport[0].teamName, podiumX + 60, yPos + 20, { align: 'center' });
        pdf.text(`${dataToExport[0].score} pts`, podiumX + 60, yPos + 25, { align: 'center' });
      }
      
      // Second place (left, medium height)
      if (dataToExport.length > 1) {
        pdf.setFillColor(66, 125, 157); // #427D9D
        pdf.rect(podiumX, yPos + 10, 35, 20, 'F');
        pdf.setFontSize(14);
        pdf.setTextColor(255, 255, 255);
        pdf.text('2', podiumX + 17.5, yPos + 20, { align: 'center' });
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);
        pdf.text(dataToExport[1].teamName, podiumX + 17.5, yPos + 35, { align: 'center' });
        pdf.text(`${dataToExport[1].score} pts`, podiumX + 17.5, yPos + 40, { align: 'center' });
      }
      
      // Third place (right, shortest)
      if (dataToExport.length > 2) {
        pdf.setFillColor(246, 148, 90); // #f6945a
        pdf.rect(podiumX + 85, yPos + 15, 35, 15, 'F');
        pdf.setFontSize(14);
        pdf.setTextColor(255, 255, 255);
        pdf.text('3', podiumX + 102.5, yPos + 25, { align: 'center' });
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);
        pdf.text(dataToExport[2].teamName, podiumX + 102.5, yPos + 35, { align: 'center' });
        pdf.text(`${dataToExport[2].score} pts`, podiumX + 102.5, yPos + 40, { align: 'center' });
      }
      
      yPos += 50; // Move down after podium
      
      // Add leaderboard table
      pdf.setFontSize(12);
      pdf.text('Leaderboard Table', pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;
      
      // Define table columns
      const tableColumns = [
        { header: 'POS', dataKey: 'position' },
        { header: 'TEAM', dataKey: 'team' },
        { header: 'MP', dataKey: 'mp' },
        { header: 'GF', dataKey: 'gf' },
        { header: 'GA', dataKey: 'ga' },
        { header: 'GD', dataKey: 'gd' },
        { header: 'PTS', dataKey: 'pts' }
      ];
      
      // Prepare table data
      const tableData = dataToExport.map((team, index) => ({
        position: index + 1,
        team: team.teamName,
        mp: team.totalMatches,
        gf: team.goalsFor,
        ga: team.goalsAgainst,
        gd: team.goalDifference,
        pts: team.score
      }));
      
      // Create table manually
      const cellPadding = 5;
      const cellHeight = 10;
      const tableX = margin;
      let tableY = yPos;
      
      // Calculate column widths
      const posWidth = 15;
      const teamWidth = 70;
      const statWidth = 15;
      const tableWidth = posWidth + teamWidth + (5 * statWidth);
      
      // Draw table header
      pdf.setFillColor(53, 98, 166); // #3562A6
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.rect(tableX, tableY, tableWidth, cellHeight, 'F');
      
      // Draw header cells
      let currentX = tableX;
      pdf.text('POS', currentX + posWidth/2, tableY + cellHeight/2 + 3, { align: 'center' });
      currentX += posWidth;
      pdf.text('TEAM', currentX + 5, tableY + cellHeight/2 + 3, { align: 'left' });
      currentX += teamWidth;
      pdf.text('MP', currentX + statWidth/2, tableY + cellHeight/2 + 3, { align: 'center' });
      currentX += statWidth;
      pdf.text('GF', currentX + statWidth/2, tableY + cellHeight/2 + 3, { align: 'center' });
      currentX += statWidth;
      pdf.text('GA', currentX + statWidth/2, tableY + cellHeight/2 + 3, { align: 'center' });
      currentX += statWidth;
      pdf.text('GD', currentX + statWidth/2, tableY + cellHeight/2 + 3, { align: 'center' });
      currentX += statWidth;
      pdf.text('PTS', currentX + statWidth/2, tableY + cellHeight/2 + 3, { align: 'center' });
      
      tableY += cellHeight;
      
      // Draw table rows
      pdf.setTextColor(0, 0, 0);
      
      tableData.forEach((row, index) => {
        // Set background color for alternating rows
        if (index % 2 === 0) {
          pdf.setFillColor(249, 250, 253); // #f9fafd
          pdf.rect(tableX, tableY, tableWidth, cellHeight, 'F');
        }
        
        // Draw cell borders
        pdf.setDrawColor(221, 221, 221); // #ddd
        pdf.rect(tableX, tableY, tableWidth, cellHeight);
        
        // Draw vertical lines for columns
        currentX = tableX + posWidth;
        pdf.line(currentX, tableY, currentX, tableY + cellHeight);
        currentX += teamWidth;
        pdf.line(currentX, tableY, currentX, tableY + cellHeight);
        currentX += statWidth;
        pdf.line(currentX, tableY, currentX, tableY + cellHeight);
        currentX += statWidth;
        pdf.line(currentX, tableY, currentX, tableY + cellHeight);
        currentX += statWidth;
        pdf.line(currentX, tableY, currentX, tableY + cellHeight);
        currentX += statWidth;
        pdf.line(currentX, tableY, currentX, tableY + cellHeight);
        
        // Set font weight for top 3 teams
        if (index < 3) {
          pdf.setFont('helvetica', 'bold');
        } else {
          pdf.setFont('helvetica', 'normal');
        }
        
        // Draw cell content
        currentX = tableX;
        pdf.text(row.position.toString(), currentX + posWidth/2, tableY + cellHeight/2 + 3, { align: 'center' });
        currentX += posWidth;
        
        // Team name might need truncation if too long
        let teamName = row.team;
        if (teamName.length > 20) {
          teamName = teamName.substring(0, 17) + '...';
        }
        pdf.text(teamName, currentX + 5, tableY + cellHeight/2 + 3, { align: 'left' });
        currentX += teamWidth;
        
        pdf.text(row.mp.toString(), currentX + statWidth/2, tableY + cellHeight/2 + 3, { align: 'center' });
        currentX += statWidth;
        pdf.text(row.gf.toString(), currentX + statWidth/2, tableY + cellHeight/2 + 3, { align: 'center' });
        currentX += statWidth;
        pdf.text(row.ga.toString(), currentX + statWidth/2, tableY + cellHeight/2 + 3, { align: 'center' });
        currentX += statWidth;
        pdf.text(row.gd.toString(), currentX + statWidth/2, tableY + cellHeight/2 + 3, { align: 'center' });
        currentX += statWidth;
        pdf.text(row.pts.toString(), currentX + statWidth/2, tableY + cellHeight/2 + 3, { align: 'center' });
        
        tableY += cellHeight;
      });
      
      // Add footer
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();
      pdf.setFontSize(8);
      pdf.setTextColor(102, 102, 102); // #666
      pdf.text(`Generated on ${currentDate} at ${currentTime}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      
      // Save the PDF
      pdf.save(`Tournament_Leaderboard${format === 'GROUP_STAGE' ? `_Group_${selectedGroup}` : ''}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ActionToolbar title="Leaderboard" totalItems={leaderboardData?.leaderBoard.length} showSearch={false}>
        <button
          onClick={handleExportLeaderboard}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
        >
          <FileDown className="h-5 w-5" />
          <span>Export Leaderboard</span>
        </button>
      </ActionToolbar>

      {/* Podium display for top 3 teams */}
      {(format === "GROUP_STAGE" || format === "ROUND_ROBIN") && (
        <FinalResultSection leaderboardData={leaderboardData} loading={loading} />
      )}

      {format === "GROUP_STAGE" && (
        <div className="mb-6 flex flex-wrap gap-2">
          {groupedStandings
            .map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`px-4 py-2 rounded-md ${
                  selectedGroup === group
                    ? "bg-emerald-500 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Group {group}
              </button>
            ))}
        </div>
      )}

      {(format === "GROUP_STAGE" || format === "ROUND_ROBIN") && (
        <LeaderboardTable 
          leaderboardData={format === "GROUP_STAGE" && leaderboardData ? 
            {
              ...leaderboardData,
              leaderBoard: leaderboardData.leaderBoard.filter(team => team.group === selectedGroup)
            } : 
            leaderboardData
          } 
          loading={loading} 
        />
      )}
    </div>
  )
}
