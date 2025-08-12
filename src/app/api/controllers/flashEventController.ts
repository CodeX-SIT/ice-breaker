import { FlashEvent, GameCode } from "@/database";
import { Op } from "sequelize";
import flashEventsData from "@/flashEvents.json";

export async function triggerFlashEvent(
  gameCodeId: number,
  eventId: string,
  triggeredBy: string,
) {
  const eventData = flashEventsData.find((event: any) => event.id === eventId);
  if (!eventData) {
    throw new Error(`Flash event '${eventId}' not found`);
  }

  // End any existing active flash events for this game
  await FlashEvent.update(
    { isActive: false },
    {
      where: {
        gameCodeId,
        isActive: true,
      },
    },
  );

  const startedAt = new Date();
  const endsAt = new Date(startedAt.getTime() + eventData.duration * 1000); // Convert seconds to milliseconds

  const flashEvent = await FlashEvent.create({
    gameCodeId,
    eventId,
    startedAt,
    endsAt,
    isActive: true,
    triggeredBy,
    eventData,
  });

  // Auto-deactivate after duration
  setTimeout(async () => {
    await FlashEvent.update(
      { isActive: false },
      { where: { id: flashEvent.id } },
    );
  }, eventData.duration * 1000);

  return flashEvent;
}

export async function getActiveFlashEvent(gameCodeId: number) {
  const activeEvent = await FlashEvent.findOne({
    where: {
      gameCodeId,
      isActive: true,
      endsAt: { [Op.gt]: new Date() },
    },
    order: [["startedAt", "DESC"]],
  });

  if (activeEvent) {
    const eventData = flashEventsData.find(
      (event: any) => event.id === activeEvent.eventId,
    );
    return {
      ...activeEvent.toJSON(),
      eventDetails: eventData,
    };
  }

  return null;
}

export async function getAllFlashEventTemplates() {
  return flashEventsData;
}

export async function endFlashEvent(gameCodeId: number, eventId?: string) {
  const whereClause: any = { gameCodeId, isActive: true };
  if (eventId) {
    whereClause.eventId = eventId;
  }

  await FlashEvent.update({ isActive: false }, { where: whereClause });

  return true;
}

export async function getFlashEventHistory(gameCodeId: number) {
  return FlashEvent.findAll({
    where: { gameCodeId },
    order: [["startedAt", "DESC"]],
  });
}
