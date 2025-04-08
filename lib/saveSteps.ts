interface Step {
  id: string;
  title: string;
  description: string;
}

export async function saveStepsToFirestore(
  userId: string,
  rackId: string,
  steps: Step[]
): Promise<void> {
  // TODO: 実際のFirestoreへの保存処理を実装
  console.log('Steps saved:', { userId, rackId, steps })
} 