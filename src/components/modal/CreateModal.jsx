import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export default function CreateModal({
	show,
	dueDate,
	setEvent,
	setShow,
	test,
}) {
	const [input, setInput] = useState({
		title: "",
		date: "",
		color: "",
	});

	const handleChange = (event) => {
		const { name, value } = event.target;
		setInput({ ...input, [name]: value });
	};
	// INPUT DATA TO SERVER
	const handleSubmit = (event) => {
		event.preventDefault();
		const { title } = input;
		fetch(`http://localhost:4000/Events`, {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				title: title,
				date: dueDate,
				color: "red",
			}),
		})
			.then((res) => {
				if (!res.ok) throw new Error("Create failed");
				return res.json();
			})
			.then((data) => test(data))
			.finally(() => setShow(false))
			.catch((err) => console.log(err));
	};
	const onClose = () => {
		setShow(false);
	};
	return (
		<>
			<Transition appear show={show} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={onClose}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-60" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<div className="flex justify-between">
										<h3 className="text-lg font-medium leading-6 text-gray-900">
											New Event
										</h3>
										<div className="font-bold">
											<button onClick={onClose} className="">
												X
											</button>
										</div>
									</div>

									<div className="container mt-5">
										<form onSubmit={handleSubmit}>
											<label htmlFor="formTitle">Event: </label>
											<input
												type="text"
												className="border"
												name="title"
												value={input.title}
												placeholder="name"
												onChange={handleChange}
											/>
											<div className="mt-4 rounded-xl">
												<button
													type="button"
													onClick={handleSubmit}
													className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
												>
													SUBMIT
												</button>
											</div>
										</form>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
