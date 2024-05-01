import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function AgendaDialog(props) {
  const {
    formData,
    open,
    cancelAgenda,
    handleInputChange,
    handleSave,
    sessions,
  } = props;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={cancelAgenda}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                style={{ maxWidth: "40%" }}
                className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg w-full max-w-lg sm:p-6"
              >
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={cancelAgenda}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Dodaj Agendu
                    </Dialog.Title>
                    <form id="agendaForm">
                      <div className="space-y-12 sm:space-y-16">
                        <div>
                          <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                              <label
                                htmlFor="username"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                              >
                                Naziv
                              </label>
                              <div className="mt-2 sm:col-span-2 sm:mt-0">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                  <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={handleInputChange}
                                    value={formData.title}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                              <label
                                htmlFor="about"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                              >
                                Opis
                              </label>
                              <div className="mt-2 sm:col-span-2 sm:mt-0">
                                <textarea
                                  id="about"
                                  name="description"
                                  rows={3}
                                  className="block w-full max-w-2xl rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  defaultValue={""}
                                  onChange={handleInputChange}
                                  value={formData.description}
                                />
                                <p className="mt-3 text-sm leading-6 text-gray-600">
                                  Napišite par reči o agendi
                                </p>
                              </div>
                            </div>
                            <div>
                              <div className=" space-y-10 sm:pb-0">
                                <fieldset>
                                  <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4 sm:py-6">
                                    <div
                                      className="text-sm font-semibold leading-6 text-gray-900"
                                      aria-hidden="true"
                                    >
                                      Tip
                                    </div>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                      <div className="max-w-lg">
                                        <div className="mt-6 space-y-6">
                                          <div className="flex items-center gap-x-3">
                                            <input
                                              id="push-everything"
                                              name="agenda_type"
                                              type="radio"
                                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                              onChange={handleInputChange}
                                              value="pre_agenda"
                                            />
                                            <label
                                              htmlFor="push-everything"
                                              className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                              Pre Agenda
                                            </label>
                                          </div>
                                          <div className="flex items-center gap-x-3">
                                            <input
                                              id="push-email"
                                              name="agenda_type"
                                              type="radio"
                                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                              onChange={handleInputChange}
                                              value="daily_agenda"
                                            />
                                            <label
                                              htmlFor="push-email"
                                              className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                              Dnevna Agenda
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </fieldset>
                              </div>

                              <div className=" space-y-10 sm:pb-0">
                                <fieldset>
                                  <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4 sm:py-6">
                                    <div
                                      className="text-sm font-semibold leading-6 text-gray-900"
                                      aria-hidden="true"
                                    >
                                      Sednica
                                    </div>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                      <div className="max-w-lg">
                                        <div className="mt-6 space-y-6">
                                          {sessions.map((item) => (
                                            <div
                                              key={item.id}
                                              className="flex items-center gap-x-3"
                                            >
                                              <input
                                                id="push-email"
                                                name="session"
                                                type="radio"
                                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                onChange={handleInputChange}
                                                value={item.id}
                                              />
                                              <label
                                                htmlFor="push-email"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                              >
                                                {item.name}
                                              </label>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </fieldset>
                              </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                              <label
                                htmlFor="about"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                              >
                                Dokument
                              </label>
                              <div className="mt-2 sm:col-span-2 sm:mt-0">
                                <input
                                  type="file"
                                  id="about"
                                  name="pdf_path"
                                  rows={3}
                                  className="block w-full max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  defaultValue={""}
                                  onChange={handleInputChange}
                                  //   value={formData.pdf_path}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                          type="button"
                          className="text-sm font-semibold leading-6 text-gray-900"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Save
                        </button>
                      </div> */}
                    </form>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={cancelAgenda}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
