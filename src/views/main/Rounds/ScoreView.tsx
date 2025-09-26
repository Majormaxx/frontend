import { apiGetAssessmentsByAssessed } from "@/services/OrgService";
import { RootState, setSelectedRound } from "@/store";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Avatar, Button, Card, Skeleton } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { HiArrowSmLeft } from "react-icons/hi";
import placeholderIcon from '@/assets/images/placeholder.jpg';
import { ScoreDetailCard } from "../Scores/ScoreDetailCard";
import BerryPartialRating from "@/components/collabberry/custom-components/CustomFields/BerryPartialRating";
import { RoundStatus } from "@/components/collabberry/utils/collabberry-constants";

const NoScoreAvailable: React.FC = () => (
  <span className="ml-1 font-semibold">N/A</span>
);


const ContributorScoreView: React.FC = () => {
  const organization = useSelector((state: RootState) => state.auth.org);
  const navigate = useNavigate();
  const { selectedRound, selectedUser } = useSelector(
    (state: RootState) => state.auth.rounds
  );
  const [loading, setLoading] = useState(false);
  const [assessments, setAssessments] = useState<any[]>([]);

  const navigateBack = () => {
    navigate(-1);
  };

  React.useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      try {
        const assessments = await apiGetAssessmentsByAssessed(
          selectedRound?.id,
          selectedUser?.id
        );
        const enrichedAssessments = assessments.data.map(
          (assessment: { assessorId: string }) => {
            const contributor = organization?.contributors?.find(
              (contributor) => contributor.id === assessment.assessorId
            );
            return {
              ...assessment,
              assessor: contributor,
            };
          }
        );
        setAssessments(enrichedAssessments);
      }
      catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  return (
    <>
      {selectedRound && selectedUser && (
        <>
          <div>
            <Button size="sm" onClick={navigateBack} icon={<HiArrowSmLeft />}>
              Back to Round
            </Button>
          </div>
          <div>
            {/* <div className="flex flex-row justify-between">
              <h1>Round {setSelectedRound?.roundName}</h1>
            </div> */}
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-start">
                  {
                    selectedUser?.profilePicture ? (
                      <Avatar
                        className="mr-2 h-24 w-24 rounded-full"
                        src={selectedUser.profilePicture}
                      />
                    ) : (
                      <Avatar
                        className="mr-2 h-24 w-24 rounded-full"
                        src={placeholderIcon}
                      />
                    )

                  }
                  <div>
                    <div className="organization-name mr-2 text-2xl text-gray-900">
                      {selectedUser?.username}
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Total Score:</span>
                        {
                          selectedRound?.status === RoundStatus.Completed ? (
                            <div className="flex flex-row items-center gap-1">
                              <span className="ml-1 font-bold">
                                {selectedUser?.totalScore.toFixed(1) || 0}
                              </span>
                              <BerryPartialRating rating={+selectedUser?.totalScore?.toFixed(1)} width={14} height={14} />
                            </div>

                          ) : (
                            <NoScoreAvailable />
                          )
                        }


                      </div>
                      <div className="flex justify-between">
                        <span> Work Score:</span>

                        {
                          selectedRound?.status === RoundStatus.Completed ? (
                            <div className="flex flex-row items-center gap-1">
                              <span className="ml-1 font-bold">
                                {selectedUser?.workScore.toFixed(1) || 0}
                              </span>
                              <BerryPartialRating rating={+selectedUser?.workScore?.toFixed(1)} width={14} height={14} />
                            </div>

                          ) : (
                            <NoScoreAvailable />
                          )
                        }

                      </div>
                      <div className="flex justify-between">
                        <span> Culture Score:</span>

                        {
                          selectedRound?.status === RoundStatus.Completed ? (
                            <div className="flex flex-row items-center gap-1">
                              <span className="ml-1 font-bold">
                                {selectedUser?.cultureScore.toFixed(1) || 0}
                              </span>
                              <BerryPartialRating rating={+selectedUser?.cultureScore?.toFixed(1)} width={14} height={14} />
                            </div>

                          ) : (
                            <NoScoreAvailable />
                          )
                        }

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4">
              {
                loading ? (<Skeleton height={187} />) : (
                  <>
                    {assessments.length > 0 ? (
                      assessments?.map(
                        ({
                          assessor,
                          cultureScore,
                          workScore,
                          feedbackNegative,
                          feedbackPositive,
                        }: {
                          assessor: any;
                          cultureScore: number;
                          workScore: number;
                          feedbackNegative: string;
                          feedbackPositive: string;
                        }) => (
                          <ScoreDetailCard
                            key={assessor?.id}
                            contributor={assessor}
                            workScore={workScore}
                            cultureScore={cultureScore}
                            feedbackPositive={feedbackPositive}
                            feedbackNegative={feedbackNegative}
                          />
                        )
                      )
                    ) : (
                      <Alert showIcon type="warning" className="mt-4">
                        <p>
                          {selectedUser?.username || "This user"} has not received any
                          assessments.
                        </p>
                      </Alert>
                    )}
                  </>
                )
              }
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ContributorScoreView;
